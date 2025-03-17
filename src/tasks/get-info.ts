import { homedir, platform } from 'node:os';
import { arch } from 'node:process';

import chalk from 'chalk';
import { getCoreConfig } from '@rodbe/get-config';

import { LONG_CONFIG_CACHE_NAME, RERUN_CACHE_NAME, SHORT_CONFIG_CACHE_NAME } from '@/constants';
import { getNslPkgJson, getNSLDistPath, getCacheFilePath } from '@/helpers/nsl';
import { logNslBanner } from '@/helpers/log';
import { getNodeVersion } from './get-node-version';

export const aboutNSL = (argv: Record<string, any>) => {
  const rerunCachePath = getCacheFilePath(RERUN_CACHE_NAME);
  const shortConfigCachePath = getCacheFilePath(SHORT_CONFIG_CACHE_NAME);
  const longConfigCachePath = getCacheFilePath(LONG_CONFIG_CACHE_NAME);

  logNslBanner();

  console.log(chalk.black.bold.bgGreenBright('Current version ->'), getNslPkgJson().version);
  console.log(chalk.black.bold.bgGreenBright('NSL directory ->'), getNSLDistPath());
  console.log(
    chalk.black.bold.bgGreenBright('ConfigFile ->'),
    getCoreConfig('nsl', { debug: true })
  );
  console.log(chalk.black.bold.bgGreenBright('Arguments ->'), JSON.stringify(argv));
  console.log(chalk.black.bold.bgGreenBright('Home ->'), homedir());
  console.log(chalk.black.bold.bgGreenBright('Machine ->'), arch);
  console.log(chalk.black.bold.bgGreenBright('Platform ->'), platform());
  console.log(chalk.black.bold.bgGreenBright('rerunCachePath ->'), rerunCachePath);
  console.log(chalk.black.bold.bgGreenBright('shortConfigCachePath ->'), shortConfigCachePath);
  console.log(chalk.black.bold.bgGreenBright('longConfigCachePath ->'), longConfigCachePath);
  console.log(chalk.black.bold.bgGreenBright('NodeJS ->'), getNodeVersion().version);
};
