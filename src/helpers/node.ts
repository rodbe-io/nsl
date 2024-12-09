import type { Script } from '@/models/script.types';
import { getPackageManager } from '@/utils/node';

export const getCommandToRun = (answerSelected: Script['value'], rootPackageManager: string | null) => {
  const { folderContainer, packageManager, scriptName, packageName } = answerSelected;
  const runner = getPackageManager(packageManager || rootPackageManager);

  if (folderContainer === 'Root' || !rootPackageManager) {
    return `${runner} run ${scriptName}`;
  }

  if (runner === 'pnpm') {
    return `pnpm -F ${packageName} ${scriptName}`;
  }

  if (runner === 'yarn') {
    return `yarn workspace ${packageName} ${scriptName}`;
  }

  return `npm run ${scriptName} -w ${folderContainer}`;
};
