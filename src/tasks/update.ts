import { execSync } from 'node:child_process';

import chalk from 'chalk';
import fetch from 'node-fetch';
import { to } from '@rodbe/fn-utils';

import { cacheFactory } from '@/adapters/cache';
import { SHORT_CONFIG_CACHE_NAME, STATUS, DAY_IN_MS } from '@/constants';
import { getNslPkgJson } from '@/helpers/nsl';

const commandToInstallNsl = 'npm i -g @rodbe/nsl';

const shortConfigCache = cacheFactory<string, any>({
  max: 10,
  ttl: DAY_IN_MS,
  cacheName: SHORT_CONFIG_CACHE_NAME,
});

type NpmPackage = {
  'dist-tags': {
    latest: string;
  };
};

const getRemotePackageJson = async (packageName: string) => {
  const [err, response] = await to<NpmPackage>(
    fetch(`https://registry.npmjs.org/${packageName}`).then(res => res.json() as Promise<NpmPackage>)
  );

  if (err) {
    return null;
  }

  const version = response['dist-tags'].latest;

  return { version };
};

export const update = async () => {
  execSync(commandToInstallNsl, {
    cwd: process.cwd(),
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  shortConfigCache.setCache('status', STATUS.UPDATED);
};

export const checkAvailableUpdate = async () => {
  if (shortConfigCache.getCache('status') === STATUS.UPDATED) {
    return;
  }

  const remotePkgJson = await getRemotePackageJson(getNslPkgJson().name);
  if (!remotePkgJson) {
    return;
  }

  if (remotePkgJson.version === getNslPkgJson().version) {
    shortConfigCache.setCache('status', STATUS.UPDATED);

    return;
  }

  console.log(chalk.black.bold.bgGreenBright('Downloading latest version 🔥🔥🔥'));
  shortConfigCache.deleteCache('status');
  await update();
};
