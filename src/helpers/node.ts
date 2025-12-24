import type { ScriptForInquirer } from '@/models/script.types';
import { getPackageManager } from '@/utils/node';
import { voltaExists } from './volta';

const getCommandToRunFromRoot = (
  answerSelected: ScriptForInquirer['value'],
  rootPkgManager?: string
) => {
  const { folderContainer, packageManager, scriptName, packageName } = answerSelected;
  const runner = getPackageManager(packageManager ?? rootPkgManager);

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
  rootPkgManager?: string
) => {
  const { packageManager, scriptName } = answerSelected;
  const runner = getPackageManager(packageManager ?? rootPkgManager);
  const commandToRun = `${runner} run ${scriptName}`;

  if (voltaExists()) {
    return `volta run npm run ${scriptName}`;
  }

  return commandToRun;
};

type GetCommandToRunParams = {
  answerSelected: ScriptForInquirer['value'];
  rootPkgManager?: string;
};

export const getCommandToRun = ({ answerSelected, rootPkgManager }: GetCommandToRunParams) => {
  const commandToRunFromRoot = getCommandToRunFromRoot(answerSelected, rootPkgManager);
  const commandToRunFromFolder = getCommandToRunFromFolder(answerSelected, rootPkgManager);

  return {
    root: commandToRunFromRoot,
    folder: commandToRunFromFolder,
  };
};
