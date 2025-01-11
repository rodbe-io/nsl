import { execSync } from 'node:child_process';

import pkgJson from 'package-json';
import select from '@inquirer/select';

import { cacheFactory } from '@/adapters/cache';
import { SHORT_CONFIG_CACHE_NAME, LONG_CONFIG_CACHE_NAME, STATUS, DAY_IN_MS, WEEK_IN_MS } from '@/constants';
import { getNslPkgJson } from '@/helpers/nsl';
import { logNslBanner } from '@/helpers/log';

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

const commandToInstallNsl = 'npm i -g @rodbe/nsl';

const shortConfigCache = cacheFactory<string, any>({
  max: 10,
  ttl: DAY_IN_MS,
  cacheName: SHORT_CONFIG_CACHE_NAME,
});
const longConfigCache = cacheFactory<string, any>({
  max: 10,
  ttl: WEEK_IN_MS,
  cacheName: LONG_CONFIG_CACHE_NAME,
});

export const update = async () => {
  execSync(commandToInstallNsl, {
    cwd: process.cwd(),
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  longConfigCache.setCache('status', STATUS.UPDATED);
  shortConfigCache.deleteCache('dontAsk');
};

export const checkAvailableUpdate = async () => {
  if (longConfigCache.getCache('status') === STATUS.UPDATED) {
    return;
  }

  if (shortConfigCache.getCache('dontAsk')) {
    return;
  }

  const remotePkgJson = await pkgJson(getNslPkgJson().name);

  if (remotePkgJson.version === getNslPkgJson().version) {
    longConfigCache.setCache('status', STATUS.UPDATED);
    return;
  }

  logNslBanner();
  const updateAnswer = await select(updateOptions);

  if (updateAnswer) {
    await update();
  } else {
    shortConfigCache.setCache('dontAsk', true);
    longConfigCache.deleteCache('status');
  }
};
