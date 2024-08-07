#!/usr/bin/env node

import figlet from 'figlet';
import chalk from 'chalk';
import { search } from '@inquirer/prompts';

import { getAllScriptsFromPackageJsons } from '@/utils/fs';
import { fuzzySearch } from '@/utils/object';
import {
  getGroupedScriptsWithInquirerFormat,
  groupedScriptsWithTableProp,
  groupScriptsByFolder,
  type GroupedScriptTable,
} from './mapper';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const runner = 'npm';
// const __dirname = import.meta.dirname;

process.stdin.on('keypress', (_, key) => {
  if (key && key.name === 'escape') {
    process.exit(0);
  }
});

const init = async () => {
  console.log(chalk.magenta(figlet.textSync('- NSL -', { horizontalLayout: 'full' })));
  const argv = await yargs(hideBin(process.argv)).argv;
  const cwd = process.cwd();
  if (argv.debug) {
    console.log('arguments:', argv);
    execSync('node -v', { cwd, stdio: [process.stdin, process.stdout, process.stderr] });
  }

  const allScripts = getAllScriptsFromPackageJsons(cwd);
  const groupedScripts = groupScriptsByFolder(allScripts);
  const groupedScriptsWithTable = groupedScriptsWithTableProp(groupedScripts);
  const groupedScriptsWithInquirerFormat = getGroupedScriptsWithInquirerFormat(groupedScriptsWithTable);

  const answer = await search({
    message: 'Select a script to run:',
    pageSize: 30,
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

  const commandToRun = `${runner} run ${answer.scriptName}`;
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);

  execSync(commandToRun, {
    cwd: scriptPath,
    stdio: [process.stdin, process.stdout, process.stderr],
    // stdio: 'inherit',
  });
};

init();
