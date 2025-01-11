const DEFAULT_RUNNER = 'npm';

export const getPackageManager = (packageManager?: string) => {
  if (!packageManager) {
    return DEFAULT_RUNNER;
  }

  const regex = /npm|pnpm|yarn|bun/;
  const match = regex.exec(packageManager);

  if (match) {
    return match[0];
  }

  return DEFAULT_RUNNER;
};
