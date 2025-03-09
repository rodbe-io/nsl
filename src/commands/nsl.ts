#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { checkUpdates } from '@rodbe/check-updates';

import { getMainPkgJsonPath, getNslPkgJson } from '@/helpers/nsl';
import { aboutNSL } from '@/tasks/get-info';
import { findAndExecScript } from '@/tasks/find-and-exec-script';
import { initEvents } from '@/events';
import { DAY_IN_MS, WEEK_IN_MS } from '@/constants';

initEvents();

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

  const { update, checkNewVersion } = checkUpdates({
    askToUpdate: true,
    dontAskCheckInterval: DAY_IN_MS,
    packageJsonPath: getMainPkgJsonPath(),
    updateCheckInterval: WEEK_IN_MS,
  });

  if (argv.update) {
    update?.();
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

  await checkNewVersion?.();
  await findAndExecScript(argv);
};

init();
