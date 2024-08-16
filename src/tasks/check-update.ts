import figlet from 'figlet';
import chalk from 'chalk';
import pkgJson from 'package-json';
import select from '@inquirer/select';
import { execSync } from 'node:child_process';
import boxen from 'boxen';

import { cacheFactory } from '@/adapters/cache';
import { SHORT_CONFIG_CACHE_NAME, MONTH_IN_MS, LONG_CONFIG_CACHE_NAME, STATUS } from '@/constants';
import { getPkgJsonProject } from '@/utils/fs';

const updateOptions = {
  message: 'Heey! Before, do you want to get the latest version? 🔥',
  default: true,
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
};

export const checkAvailableUpdate = async () => {
  const cwd = process.cwd();
  const shortConfigCache = cacheFactory<string, any>({
    max: 10,
    // NOTE: while we are in beta stage
    ttl: MONTH_IN_MS, // DAY_IN_MS,
    cacheName: SHORT_CONFIG_CACHE_NAME,
  });
  const longConfigCache = cacheFactory<string, any>({
    max: 10,
    // NOTE: while we are in beta stage
    ttl: MONTH_IN_MS, // WEEK_IN_MS,
    cacheName: LONG_CONFIG_CACHE_NAME,
  });

  if (longConfigCache.getCache('status') === STATUS.UPDATED) {
    return;
  }

  if (shortConfigCache.getCache('dontAsk')) {
    return;
  }

  const remotePkgJson = await pkgJson(getPkgJsonProject().name);

  if (remotePkgJson.version === getPkgJsonProject().version) {
    longConfigCache.setCache('status', STATUS.UPDATED);
    return;
  }

  console.log(
    boxen(chalk.magenta(figlet.textSync('- NSL -', { horizontalLayout: 'full' })), {
      borderColor: 'cyan',
      borderStyle: 'classic',
      margin: 1,
      padding: 1,
      textAlignment: 'center',
      title: 'Node Script List',
      titleAlignment: 'center',
    })
  );
  const update = await select(updateOptions);

  if (update) {
    execSync('npm i -g @rodbe/nsl', {
      cwd,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    longConfigCache.setCache('status', STATUS.UPDATED);
    shortConfigCache.deleteCache('dontAsk');
  } else {
    shortConfigCache.setCache('dontAsk', true);
    longConfigCache.deleteCache('status');
  }
};
