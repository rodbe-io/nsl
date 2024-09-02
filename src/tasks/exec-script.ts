import search from '@inquirer/search';
import { execSync } from 'child_process';
import { join } from 'node:path';

import {
  groupScriptsByFolder,
  groupedScriptsWithTableProp,
  getGroupedScriptsWithInquirerFormat,
  type GroupedScriptTable,
} from '@/mapper';
import { getAllScriptsFromPackageJsons } from '@/utils/fs';
import { getPackageManager } from '@/utils/node';
import { fuzzySearch } from '@/utils/object';
import { compose } from '@/utils/fp';
import { NPM_SCRIPTS_TO_IGNORE, PAGE_SIZE, QUATER_IN_MS, RERUN_CACHE_NAME } from '@/constants';
import { cacheFactory } from '@/adapters/cache';
import type { Config, ExecScriptParams, Script } from '@/models/script.types';
import { getConfig } from './get-config';

const filterScripts = (all?: boolean) => (config: Config | null) => (scripts: Script[]) => {
  if (all) {
    return scripts;
  }

  return scripts.filter(script => {
    const scriptsToIgnore = NPM_SCRIPTS_TO_IGNORE.concat(config?.ignoreScripts || []);

    return !scriptsToIgnore.includes(script.value.scriptName);
  });
};

export const execScript = async ({ all, debug }: ExecScriptParams) => {
  const cwd = process.cwd();
  const { setCache } = cacheFactory<Script['value'], any>({
    max: 3,
    ttl: QUATER_IN_MS,
    cacheName: RERUN_CACHE_NAME,
  });
  const config = await getConfig(cwd, { debug });
  const groupedScripts = compose(groupScriptsByFolder, filterScripts(all)(config), getAllScriptsFromPackageJsons)(cwd);
  const groupedScriptsWithTable = groupedScriptsWithTableProp(groupedScripts);
  const groupedScriptsWithInquirerFormat = getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable);

  const answer = await search({
    message: 'Select or search a script to run:',
    pageSize: PAGE_SIZE,
    source: input => {
      if (!input) {
        return groupedScriptsWithInquirerFormat;
      }

      const filtered = Object.entries(groupedScriptsWithTable).reduce<GroupedScriptTable>(
        (acc, [folderContainer, currentScripts]) => {
          const filteredScripts = fuzzySearch({ searchText: input, items: currentScripts, key: 'name' });
          acc[folderContainer] = filteredScripts;

          return acc;
        },
        {}
      );

      return getGroupedScriptsWithInquirerFormat(filtered);
    },
  });

  setCache(cwd, answer);
  const rummer = getPackageManager(answer.packageManager);
  const commandToRun = `${rummer} run ${answer.scriptName}`;
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);
  console.log(commandToRun);

  execSync(commandToRun, {
    cwd: scriptPath,
    stdio: [process.stdin, process.stdout, process.stderr],
  });
};
