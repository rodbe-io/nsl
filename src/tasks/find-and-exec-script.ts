import { setTimeout } from 'node:timers/promises';

import search from '@inquirer/search';
import { getConfig } from '@rodbe/get-config';
import { compose, fuzzySearch, purge } from '@rodbe/fn-utils';
import type { NormalizedScripts } from '@rodbe/get-package-jsons';

import {
  getGroupedScriptsWithTableProp,
  getGroupedScriptsWithInquirerFormat,
  type GroupedScriptsTable,
} from '@/mapper';
import { getAllScriptsFromPackageJsons } from '@/utils/fs';
import { NPM_SCRIPTS_TO_IGNORE, PAGE_SIZE } from '@/constants';
import type { Config, ExecScriptParams } from '@/models/script.types';
import { execScript } from './exec-script';

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
  const config = await getConfig<Config>('nsl', { debug });
  const groupedScripts = compose(filterScripts(all)(config), getAllScriptsFromPackageJsons)(cwd);
  const groupedScriptsWithTable = getGroupedScriptsWithTableProp(groupedScripts);
  const groupedScriptsWithInquirerFormat =
    getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable);
  const rootPackageJson = groupedScripts?.['Root'];

  const answerSelected = await search({
    message: 'Select or search a script to run:',
    pageSize: PAGE_SIZE,
    source: async (input) => {
      if (!input) {
        return groupedScriptsWithInquirerFormat;
      }
      await setTimeout(DEBOUNCE_TIME);

      const inputTexts = purge(input.split(' ')) as [string, string | undefined];
      const [scriptToSearch, projectToSearch] = inputTexts;
      let filteredScriptsList: GroupedScriptsTable;

      if (projectToSearch) {
        filteredScriptsList = Object.entries(groupedScriptsWithTable).reduce<GroupedScriptsTable>(
          (acc, [folderContainer, currentScripts]) => {
            const filteredScripts = fuzzySearch({
              searchText: projectToSearch,
              items: currentScripts,
              key: 'value.folderContainer',
            });
            acc[folderContainer] = filteredScripts;

            return acc;
          },
          {}
        );

        const filtered = Object.entries(filteredScriptsList).reduce<GroupedScriptsTable>(
          (acc, [folderContainer, currentScripts]) => {
            const filteredScripts = fuzzySearch({
              searchText: scriptToSearch,
              items: currentScripts,
              key: 'name',
            });
            acc[folderContainer] = filteredScripts;

            return acc;
          },
          {}
        );

        return getGroupedScriptsWithInquirerFormat(filtered);
      }

      const filtered = Object.entries(groupedScriptsWithTable).reduce<GroupedScriptsTable>(
        (acc, [folderContainer, currentScripts]) => {
          const filteredScripts = fuzzySearch({
            searchText: scriptToSearch,
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

  const rootPkgManager = rootPackageJson?.packageManager;
  execScript({ answerSelected, cwd, debug, print, rootPkgManager });
};
