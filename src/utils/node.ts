import { DEFAULT_RUNNER } from '@/constants';

export const getPackageManager = (packageManager: string) => {
  const regex = /npm|pnpm|yarn|bun/;
  const match = regex.exec(packageManager);

  if (match) {
    return match[0];
  }

  return DEFAULT_RUNNER;
};
