import type { ScriptForInquirer } from '@/models/script.types';
import { getPackageManager } from '@/utils/node';
import { voltaExists } from './volta';

const getCommandToRunFromRoot = (
  answerSelected: ScriptForInquirer['value'],
  rootPackageManager?: string
) => {
  const { folderContainer, packageManager, scriptName, packageName } = answerSelected;
  const runner = getPackageManager(packageManager ?? rootPackageManager);

  if (folderContainer === 'Root') {
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

const getCommandToRunFromFolder = (
  answerSelected: ScriptForInquirer['value'],
  rootPackageManager?: string
) => {
  const { packageManager, scriptName } = answerSelected;
  const runner = getPackageManager(packageManager ?? rootPackageManager);
  const commandToRun = `${runner} run ${scriptName}`;

  if (voltaExists()) {
    return `volta run npm run ${scriptName}`;
  }

  return commandToRun;
};

export const getCommandToRun = (
  answerSelected: ScriptForInquirer['value'],
  rootPackageManager?: string
) => {
  const commandToRunFromRoot = getCommandToRunFromRoot(answerSelected, rootPackageManager);
  const commandToRunFromFolder = getCommandToRunFromFolder(answerSelected, rootPackageManager);

  return {
    root: commandToRunFromRoot,
    folder: commandToRunFromFolder,
  };
};
