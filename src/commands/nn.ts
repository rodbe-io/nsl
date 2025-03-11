#!/usr/bin/env node

import chalk from 'chalk';
import select from '@inquirer/select';

import { rerunCache } from '@/helpers/cache';
import { execScript } from '@/tasks/exec-script';
import { initEvents } from '@/events';

initEvents();

export const init = async () => {
  const cwd = process.cwd();
  const rrCache = rerunCache();
  const cached = rrCache.get(cwd);

  if (cached) {
    const { debug, print, rootPkgManager, answer, commandToRun } = cached;
    const rerunOpts = {
      choices: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
      default: true,
      message: `Do you want to rerun: ${chalk.black.bold.bgGreenBright(commandToRun.root)}`,
    };
    const res = await select(rerunOpts);
    if (!res) {
      return;
    }

    if (debug || print) {
      console.log(chalk.black.bold.bgGreenBright('NSL params ->'), { debug, print });
    }
    execScript({ answer, cwd, debug, print, rootPkgManager });
  } else {
    console.log(chalk.white.bold.bgMagenta(`Hey, there is no "last script" to run`));
  }
};

await init();
