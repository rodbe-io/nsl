#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getNSLPkgJson } from '@/utils/fs';
import { checkAvailableUpdate } from './tasks/check-update';
import { debugIt } from './tasks/get-info';
import { execScript } from './tasks/exec-script';

process.stdin.on('keypress', (_, key) => {
  if (key && key.name === 'escape') {
    process.exit(0);
  }
});

const init = async () => {
  const argv = await yargs(hideBin(process.argv))
    .version(false)
    .options({
      all: { alias: 'a', type: 'boolean', default: false },
      info: { alias: 'i', type: 'boolean', default: false },
      version: { alias: 'v', type: 'boolean', default: false },
    }).argv;

  await checkAvailableUpdate();

  if (argv.info) {
    debugIt(argv);
    process.exit(0);
  }
  if (argv.version) {
    console.log(getNSLPkgJson().version);
    process.exit(0);
  }

  await execScript(argv);
};

init();
