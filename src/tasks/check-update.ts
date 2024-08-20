import pkgJson from 'package-json';
import select from '@inquirer/select';
import { execSync } from 'node:child_process';

import { cacheFactory } from '@/adapters/cache';
import { SHORT_CONFIG_CACHE_NAME, LONG_CONFIG_CACHE_NAME, STATUS, DAY_IN_MS, WEEK_IN_MS } from '@/constants';
import { getPkgJsonProject } from '@/utils/fs';
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

export const checkAvailableUpdate = async () => {
  const cwd = process.cwd();
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

  logNslBanner();
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
