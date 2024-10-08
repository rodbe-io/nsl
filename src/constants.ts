export const DEFAULT_RUNNER = 'npm';

export const PAGE_SIZE = 20;

export const FOLDERS_TO_IGNORE = [
  '_',
  '.git',
  '.github',
  '.husky',
  '.nx',
  '.vscode',
  'assets',
  'build',
  'cache',
  'dist',
  'node_modules',
  'patches',
  'results',
];

const BASE_CACHE_KEY = 'nsl';
export const RERUN_CACHE_NAME = `${BASE_CACHE_KEY}-rerun-cache`;
export const SHORT_CONFIG_CACHE_NAME = `${BASE_CACHE_KEY}-short-config-cache`;
export const LONG_CONFIG_CACHE_NAME = `${BASE_CACHE_KEY}-long-config-cache`;

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;
export const WEEK_IN_MS = 7 * DAY_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;
export const QUATER_IN_MS = 3 * MONTH_IN_MS;

export const STATUS = {
  NOT_UPDATED: 'NOT_UPDATED',
  UPDATED: 'UPDATED',
};

export const NPM_SCRIPTS_TO_IGNORE = [
  'dependencies',
  'install',
  'postinstall',
  'postpack',
  'postprepare',
  'postpublish',
  'postrestart',
  'poststart',
  'poststop',
  'posttest',
  'postversion',
  'preinstall',
  'prepack',
  'prepare',
  'preprepare',
  'prepublish',
  'prepublishOnly',
  'prerestart',
  'prestart,',
  'prestop',
  'pretest',
  'preversion',
  'publish',
  'restart',
];

export const CONFIG_FILES = ['.nslrc', '.nslrc.json', '.nslrc.js', '.nslrc.cjs'];
