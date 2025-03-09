import { execSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { join } from 'node:path';

import search from '@inquirer/search';
import chalk from 'chalk';
import { compose, fuzzySearch, tryCatch } from '@rodbe/fn-utils';
import type { NormalizedScripts } from '@rodbe/get-package-jsons';

import {
  getGroupedScriptsWithTableProp,
  getGroupedScriptsWithInquirerFormat,
  type GroupedScriptsTable,
} from '@/mapper';
import { getAllScriptsFromPackageJsons } from '@/utils/fs';
import { NPM_SCRIPTS_TO_IGNORE, PAGE_SIZE } from '@/constants';
import type { Config, ExecScriptParams } from '@/models/script.types';
import { getConfig } from './get-config';
import { getCommandToRun } from '@/helpers/node';
import { rerunCache } from '@/helpers/cache';

const DEBOUNCE_TIME = 300;

const filterScripts =
  (all?: boolean) => (config: Config | null) => (packageJsons: NormalizedScripts) => {
    if (all) {
      return packageJsons;
    }

    const scriptsToIgnore = NPM_SCRIPTS_TO_IGNORE.concat(config?.ignoreScripts || []);

    return Object.entries(packageJsons).reduce<NormalizedScripts>(
      (acc, [folderContainer, packageJson]) => {
        const scripts = packageJson.scripts;

        if (!scripts) {
          acc[folderContainer] = packageJson;

          return acc;
        }

        const filteredScripts = scripts.filter(
          (script) => !scriptsToIgnore.includes(script.scriptName)
        );
        acc[folderContainer] = { ...packageJson, scripts: filteredScripts };

        return acc;
      },
      {}
    );
  };

export const findAndExecScript = async ({ all, debug, print }: ExecScriptParams) => {
  const cwd = process.cwd();
  const { syncFs } = rerunCache();
  const config = await getConfig(cwd, { debug });
  const groupedScripts = compose(filterScripts(all)(config), getAllScriptsFromPackageJsons)(cwd);
  const groupedScriptsWithTable = getGroupedScriptsWithTableProp(groupedScripts);
  const groupedScriptsWithInquirerFormat =
    getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable);
  const rootPackageJson = groupedScripts?.Root;

  const answer = await search({
    message: 'Select or search a script to run:',
    pageSize: PAGE_SIZE,
    source: async (input) => {
      if (!input) {
        return groupedScriptsWithInquirerFormat;
      }
      await setTimeout(DEBOUNCE_TIME);
      const filtered = Object.entries(groupedScriptsWithTable).reduce<GroupedScriptsTable>(
        (acc, [folderContainer, currentScripts]) => {
          const filteredScripts = fuzzySearch({
            searchText: input,
            items: currentScripts,
            key: 'name',
          });
          acc[folderContainer] = filteredScripts;

          return acc;
        },
        {}
      );

      return getGroupedScriptsWithInquirerFormat(filtered);
    },
  });

  syncFs.setItem(cwd, answer);
  const commandToRun = getCommandToRun(answer, rootPackageJson?.packageManager);
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);
  console.log(chalk.black.bold.bgGreenBright(commandToRun.root));

  if (debug) {
    console.log({ commandToRun, scriptPath });
  }

  if (print) {
    process.exit(0);
  }

  const [err] = tryCatch(() => {
    execSync(commandToRun.folder, {
      cwd: scriptPath,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  });

  if (err) {
    console.log(chalk.white.bold.bgMagenta(`Ups, try to run the script manually `));
    console.log(commandToRun);
  }
};
