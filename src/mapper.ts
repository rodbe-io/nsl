import table from 'text-table';
import { Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Script, ScriptTable } from '@/models/script.types';

type GroupedScript = {
  [key: string]: Script[];
};
export const groupScriptsByFolder = (scripts: Script[]): GroupedScript => {
  return scripts.reduce<GroupedScript>((acc, curr) => {
    const folderContainer = curr.value.folderContainer;

    if (!acc[folderContainer]) {
      acc[folderContainer] = [curr];
    } else {
      acc[folderContainer].push(curr);
    }

    return acc;
  }, {});
};

const scriptToRowTable = (script: Script): [string, string, string] => {
  return [script.value.scriptName, '>', script.value.contentScript];
};

export type GroupedScriptTable = {
  [key: string]: ScriptTable[];
};
export const groupedScriptsWithTableProp = (groupedScripts: GroupedScript): GroupedScriptTable => {
  return Object.entries(groupedScripts).reduce<GroupedScriptTable>((acc, [folderContainer, currentScripts]) => {
    const scriptsWithRowFormat = table(currentScripts.map(scriptToRowTable), { align: ['r', 'c', 'l'] }).split('\n');

    acc[folderContainer] = currentScripts.map((script, idx) => {
      return {
        name: scriptsWithRowFormat[idx] as string,
        ...script,
      };
    });

    return acc;
  }, {});
};

export type GroupedScriptInquirerFormat = Array<ScriptTable | Separator>;
export const getGroupedScriptsWithInquirerFormat = (
  groupedScripts: GroupedScriptTable
): GroupedScriptInquirerFormat => {
  return Object.entries(groupedScripts).reduce<GroupedScriptInquirerFormat>(
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
