#!/usr/bin/env node

import process from 'node:process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getNslPkgJson } from '@/helpers/nsl';
import { checkAvailableUpdate, update } from './tasks/update';
import { aboutNSL } from './tasks/get-info';
import { execScript } from './tasks/exec-script';

process.stdin.on('keypress', (_, key) => {
  if (key && key.name === 'escape') {
    process.exit(0);
  }
});

process.on('uncaughtException', error => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    console.log('👋 until next time!');
  } else {
    throw error;
  }
});

const init = async () => {
  const argv = await yargs(hideBin(process.argv))
    .version(false)
    .options({
      all: { alias: 'a', type: 'boolean', default: false },
      debug: { alias: 'd', type: 'boolean', default: false },
      info: { alias: 'i', type: 'boolean', default: false },
      print: { alias: 'p', type: 'boolean', default: false },
      update: { alias: 'u', type: 'boolean', default: false },
      version: { alias: 'v', type: 'boolean', default: false },
    }).argv;

  if (argv.update) {
    await update();
    process.exit(0);
  }

  if (argv.info) {
    aboutNSL(argv);
    process.exit(0);
  }

  if (argv.version) {
    console.log(getNslPkgJson().version);
    process.exit(0);
  }

  await checkAvailableUpdate();
  await execScript(argv);
};

init();
