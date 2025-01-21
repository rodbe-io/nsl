import { readFileSync } from 'node:fs';

import { getAllPackageJsons } from '@rodbe/get-package-jsons';

export const readJsonFile = (filePath: string) => {
  try {
    const file = readFileSync(filePath, 'utf8');

    return JSON.parse(file.toString());
  } catch (e) {
    return null;
  }
};

export const getAllScriptsFromPackageJsons = (rootPath: string) => {
  const packageJsons = getAllPackageJsons({ cwd: rootPath });

  if (!packageJsons) {
    console.log('No package.json files found.');
    process.exit(1);
  }

  return packageJsons;
};
