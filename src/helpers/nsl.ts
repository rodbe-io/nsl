import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

export const nslCachePath = join(homedir(), '.nsl');

export const getCacheFilePath = (cacheName: string) => join(nslCachePath, cacheName);

export const getNSLDistPath = () => {
  const filename = fileURLToPath(import.meta.url);

  return dirname(filename);
};

export const getNslPkgJson = () => {
  const distPath = getNSLDistPath();
  const folderParent = join(distPath, '..', '..');
  const pkgJsonPath = join(folderParent, 'package.json');

  return JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
};
