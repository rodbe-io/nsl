import { DEFAULT_RUNNER } from '@/constants';

export const getPackageManager = (packageManager: string | null) => {
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
