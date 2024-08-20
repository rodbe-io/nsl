import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { homedir, machine, platform } from 'node:os';

import { LONG_CONFIG_CACHE_NAME, RERUN_CACHE_NAME, SHORT_CONFIG_CACHE_NAME } from '@/constants';
import { getCacheFilePath } from '@/adapters/cache';
import { getPkgJsonProject, getProjectDistPath } from '@/utils/fs';
import { logNslBanner } from '@/helpers/log';

export const debugIt = (argv: Record<string, any>) => {
  const cwd = process.cwd();
  const rerunCachePath = getCacheFilePath(RERUN_CACHE_NAME);
  const shortConfigCachePath = getCacheFilePath(SHORT_CONFIG_CACHE_NAME);
  const longConfigCachePath = getCacheFilePath(LONG_CONFIG_CACHE_NAME);

  logNslBanner();
  console.log(chalk.black.bold.bgGreenBright('Current version ->'), getPkgJsonProject().version);
  console.log(chalk.black.bold.bgGreenBright('Directory ->'), getProjectDistPath());
  console.log(chalk.black.bold.bgGreenBright('arguments ->'), JSON.stringify(argv));
  console.log(chalk.black.bold.bgGreenBright('Home ->'), homedir());
  console.log(chalk.black.bold.bgGreenBright('Machine ->'), machine());
  console.log(chalk.black.bold.bgGreenBright('Platform ->'), platform());
  console.log(chalk.black.bold.bgGreenBright('rerunCachePath ->'), rerunCachePath);
  console.log(chalk.black.bold.bgGreenBright('shortConfigCachePath ->'), shortConfigCachePath);
  console.log(chalk.black.bold.bgGreenBright('longConfigCachePath ->'), longConfigCachePath);
  execSync('node -v', { cwd, stdio: [process.stdin, process.stdout, process.stderr] });
};
