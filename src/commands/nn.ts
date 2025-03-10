#!/usr/bin/env node

import chalk from 'chalk';

import { rerunCache } from '@/helpers/cache';
import { execScript } from '@/tasks/exec-script';

export const init = () => {
  const cwd = process.cwd();
  const rrCache = rerunCache();
  const cached = rrCache.get(cwd);

  if (cached) {
    const { debug, print, rootPkgManager, ...answer } = cached;
    if (debug || print) {
      console.log(chalk.black.bold.bgGreenBright('NSL params ->'), { debug, print });
    }
    execScript({ answer, cwd, debug, print, rootPkgManager });
  } else {
    console.log(chalk.white.bold.bgMagenta(`Hey, there is no "last script" to run`));
  }
};

init();
