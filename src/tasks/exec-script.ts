import search from '@inquirer/search';

import {
  groupScriptsByFolder,
  groupedScriptsWithTableProp,
  getGroupedScriptsWithInquirerFormat,
  type GroupedScriptTable,
} from '@/mapper';
import { getAllScriptsFromPackageJsons } from '@/utils/fs';
import { fuzzySearch } from '@/utils/object';
import { execSync } from 'child_process';
import { join } from 'path';
import { DEFAULT_RUNNER, NPM_SCRIPTS_TO_IGNORE, PAGE_SIZE, QUATER_IN_MS, RERUN_CACHE_NAME } from '@/constants';
import { cacheFactory } from '@/adapters/cache';
import type { Script } from '@/models/script.types';
import { compose } from '@/utils/fp';

type ExecScriptParams = {
  all: boolean;
};

const filterScripts = (all: boolean) => (scripts: Script[]) => {
  if (all) {
    return scripts;
  }

  return scripts.filter(script => !NPM_SCRIPTS_TO_IGNORE.includes(script.value.scriptName));
};

export const execScript = async ({ all }: ExecScriptParams) => {
  const cwd = process.cwd();
  const { setCache } = cacheFactory<Script['value'], any>({
    max: 3,
    ttl: QUATER_IN_MS,
    cacheName: RERUN_CACHE_NAME,
  });

  const groupedScripts = compose(groupScriptsByFolder, filterScripts(all), getAllScriptsFromPackageJsons)(cwd);
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

  const commandToRun = `${DEFAULT_RUNNER} run ${answer.scriptName}`;
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);

  execSync(commandToRun, {
    cwd: scriptPath,
    stdio: [process.stdin, process.stdout, process.stderr],
  });
};
