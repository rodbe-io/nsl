import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

export const nslCachePath = join(homedir(), '.nsl');

export const getCacheFilePath = (cacheName: string) => join(nslCachePath, cacheName);

export const getNSLDistPath = () => {
  const filename = fileURLToPath(import.meta.url);

  return dirname(filename);
};

export const getMainPkgJsonPath = () => {
  let currentFolderPath = getNSLDistPath();
  let pkgJsonPath = '';

  while (true) {
    const { base, dir } = parse(currentFolderPath);

    if (base === 'dist') {
      pkgJsonPath = dir;
      break;
    }

    currentFolderPath = join(currentFolderPath, '..');
  }

  return join(pkgJsonPath, 'package.json');
};

export const getNslPkgJson = () => {
  return JSON.parse(readFileSync(getMainPkgJsonPath(), 'utf8'));
};
