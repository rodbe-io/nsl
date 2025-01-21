import table from 'text-table';
import { Separator } from '@inquirer/search';
import chalk from 'chalk';
import type { NormalizedScripts, Script } from '@rodbe/get-package-jsons';

import type { ScriptForInquirer } from './models/script.types';

const scriptToRowTable = (script: Script): [string, string, string] => {
  return [script.scriptName, '>', script.scriptContent];
};

export type GroupedScriptsTable = {
  [key: string]: ScriptForInquirer[];
};
export const getGroupedScriptsWithTableProp = (packageJsons: NormalizedScripts): GroupedScriptsTable => {
  return Object.entries(packageJsons).reduce<GroupedScriptsTable>((acc, [folderContainer, packageJson]) => {
    const { scripts = [], packageManager, packageName } = packageJson;
    const scriptsWithRowFormat = table(scripts.map(scriptToRowTable), { align: ['r', 'c', 'l'] }).split('\n');

    acc[folderContainer] = scripts.map<ScriptForInquirer>(({ scriptContent, scriptName }, idx) => {
      return {
        name: scriptsWithRowFormat[idx] as string,
        value: {
          folderContainer,
          packageManager,
          packageName,
          scriptContent,
          scriptName,
        },
      };
    });

    return acc;
  }, {});
};

export type GroupedScriptsInquirerFormat = Array<ScriptForInquirer | Separator>;

export const getGroupedScriptsWithInquirerFormat = (
  groupedScripts: GroupedScriptsTable
): GroupedScriptsInquirerFormat => {
  return Object.entries(groupedScripts).reduce<GroupedScriptsInquirerFormat>(
    (acc, [folderContainer, currentScripts], idx) => {
      if (!currentScripts.length) {
        return acc;
      }
      if (idx >= 1) {
        acc.push(new Separator(' '));
      }

      acc.push(new Separator(chalk.white.bold.bgMagenta(`📦 ${folderContainer}: `)));
      acc.push(...currentScripts);

      return acc;
    },
    []
  );
};
