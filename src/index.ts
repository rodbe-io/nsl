#!/usr/bin/env node

import search from '@inquirer/search';
import select from '@inquirer/select';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getAllScriptsFromPackageJsons, getPkgJsonProject } from '@/utils/fs';
import { fuzzySearch } from '@/utils/object';
import {
  getGroupedScriptsWithInquirerFormat,
  groupedScriptsWithTableProp,
  groupScriptsByFolder,
  type GroupedScriptTable,
} from './mapper';
import { cacheFactory } from './adapters/cache';
import { QUATER_IN_MS, RERUN_CACHE_NAME } from './constants';
import type { Script } from './models/script.types';
import { checkAvailableUpdate } from './tasks/check-update';
import { debugIt } from './tasks/debug';

const runner = 'npm';

process.stdin.on('keypress', (_, key) => {
  if (key && key.name === 'escape') {
    process.exit(0);
  }
});

const init = async () => {
  const cwd = process.cwd();
  const argv = await yargs(hideBin(process.argv))
    .version(false)
    .options({
      all: { alias: 'a', type: 'boolean', default: false },
      info: { alias: 'i', type: 'boolean', default: false },
      list: { alias: 'l', type: 'boolean', default: false },
      version: { alias: 'v', type: 'boolean', default: false },
    }).argv;
  await checkAvailableUpdate();

  const { getCache, setCache } = cacheFactory<Script['value'], any>({
    max: 3,
    ttl: QUATER_IN_MS,
    cacheName: RERUN_CACHE_NAME,
  });

  if (argv.info) {
    debugIt(argv);
    process.exit(0);
  }
  if (argv.version) {
    console.log(getPkgJsonProject().version);
    process.exit(0);
  }

  const allScripts = getAllScriptsFromPackageJsons(cwd);
  const groupedScripts = groupScriptsByFolder(allScripts);
  const groupedScriptsWithTable = groupedScriptsWithTableProp(groupedScripts);
  const groupedScriptsWithInquirerFormat = getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable);

  const selectedScript = getCache(cwd);

  const prompResult = async (cliArgs: typeof argv) => {
    // TODO: investigate how to set the default value. The api does not support objects
    if (cliArgs.list) {
      return await select({
        message: 'Select a script to run:',
        pageSize: 20,
        default: selectedScript,
        choices: getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable),
      });
    }

    return await search({
      message: 'Select or search a script to run:',
      pageSize: 20,
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
  };

  const answer = await prompResult(argv);
  setCache(cwd, answer);

  const commandToRun = `${runner} run ${answer.scriptName}`;
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);

  execSync(commandToRun, {
    cwd: scriptPath,
    stdio: [process.stdin, process.stdout, process.stderr],
  });
};

init();
