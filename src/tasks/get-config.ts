import { extname, join } from 'node:path';
import { existsSync } from 'node:fs';

import { CONFIG_FILES } from '@/constants';
import { readParsedFile } from '@/utils/fs';
import { to } from '@/utils/async';
import type { Config, ExecScriptParams } from '@/models/script.types';

export const getConfigFilePath = (rootPath: string, argv?: ExecScriptParams) => {
  let currentPath = rootPath;
  let configFileName = '';

  while (currentPath !== '/') {
    const foundConfigFileName = CONFIG_FILES.find(file => existsSync(join(currentPath, file)));

    if (foundConfigFileName) {
      configFileName = foundConfigFileName;
      break;
    }
    if (argv?.debug) {
      console.log(66, 'debug:', currentPath);
    }

    currentPath = join(currentPath, '..');
  }

  return join(currentPath, configFileName);
};

export const getConfig = async (rootPath: string, argv?: ExecScriptParams): Promise<Config | null> => {
  const configFilePath = getConfigFilePath(rootPath, argv);
  if (!configFilePath) {
    return null;
  }

  const extFile = extname(configFilePath);
  if (extFile === '.js') {
    const [err, config] = await to(
      import(configFilePath),
      `${configFilePath} module is not defined as ES module. Exports an object using export default`
    );
    if (err) {
      console.log(err.errInfo);
      return null;
    }

    return config.default;
  }
  if (extFile === '.cjs') {
    return require(configFilePath);
  }

  return readParsedFile(configFilePath);
};
