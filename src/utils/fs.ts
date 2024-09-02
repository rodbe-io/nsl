import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Script } from '@/models/script.types';
import { FOLDERS_TO_IGNORE } from '@/constants';
import { isEmptyObj } from './predicates';

export const readParsedFile = (filePath: string) => {
  try {
    const file = readFileSync(filePath, 'utf8');

    return JSON.parse(file.toString());
  } catch (e) {
    return null;
  }
};

type FindPackageJsonFilesProps = {
  absolutePath: string;
  fileListAccumulator?: string[];
};

const findPackageJsonFiles = ({ absolutePath, fileListAccumulator }: FindPackageJsonFilesProps) => {
  let fileList = fileListAccumulator || [];
  const filesAndFolderNames = readdirSync(absolutePath);
  const filteredLs = filesAndFolderNames.filter(fileOrFolderName => !FOLDERS_TO_IGNORE.includes(fileOrFolderName));

  filteredLs.forEach(fileOrFolderName => {
    const filePath = join(absolutePath, fileOrFolderName);
    if (statSync(filePath, { throwIfNoEntry: false })?.isDirectory()) {
      fileList = findPackageJsonFiles({ absolutePath: filePath, fileListAccumulator: fileList });
    } else if (fileOrFolderName === 'package.json') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const getScriptsFromPackageJson = (pkgPath: string): Script[] => {
  const packageJson = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const scripts: Record<string, string> = packageJson.scripts;
  const { packageManager } = packageJson;

  if (isEmptyObj(scripts)) {
    return [];
  }

  return Object.entries(scripts).map<Script>(([scriptName, contentScript]) => {
    const folderContainer =
      pkgPath
        .replace(process.cwd(), '')
        .replace('package.json', '')
        .replace(/^\/|\/$/g, '') || 'Root';

    return {
      value: { scriptName, folderContainer, contentScript, packageManager },
    };
  });
};

export const getAllScriptsFromPackageJsons = (rootPath: string): Script[] => {
  const packageJsonPaths = findPackageJsonFiles({ absolutePath: rootPath });

  if (packageJsonPaths.length === 0) {
    console.log('No package.json files found.');
    process.exit(1);
  }

  return packageJsonPaths.flatMap(pkgPath => {
    return getScriptsFromPackageJson(pkgPath);
  });
};

export const getNSLDistPath = () => {
  const filename = fileURLToPath(import.meta.url);

  return dirname(filename);
};

export const getNSLPkgJson = () => {
  const distPath = getNSLDistPath();
  const folderParent = join(distPath, '..');
  const pkgJsonPath = join(folderParent, 'package.json');

  return JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
};
