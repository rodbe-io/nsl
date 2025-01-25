import { execSync } from 'node:child_process';

import chalk from 'chalk';
import fetch from 'node-fetch';
import { to } from '@rodbe/fn-utils';
import { fsCache } from '@rodbe/lru-cache-fs';

import { SHORT_CONFIG_CACHE_NAME, STATUS, DAY_IN_MS } from '@/constants';
import { getNslPkgJson, nslCachePath } from '@/helpers/nsl';

const commandToInstallNsl = 'npm i -g @rodbe/nsl';

const shortConfigCache = fsCache<string, any, any>({
  cacheName: SHORT_CONFIG_CACHE_NAME,
  cachePath: nslCachePath,
  max: 10,
  ttl: DAY_IN_MS,
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

  shortConfigCache.syncFs.setItem('status', STATUS.UPDATED);
};

export const checkAvailableUpdate = async () => {
  if (shortConfigCache.get('status') === STATUS.UPDATED) {
    return;
  }

  const remotePkgJson = await getRemotePackageJson(getNslPkgJson().name);
  if (!remotePkgJson) {
    return;
  }

  if (remotePkgJson.version === getNslPkgJson().version) {
    shortConfigCache.syncFs.setItem('status', STATUS.UPDATED);

    return;
  }

  console.log(chalk.black.bold.bgGreenBright('Downloading latest version 🔥🔥🔥'));
  shortConfigCache.syncFs.removeItem('status');
  await update();
};
