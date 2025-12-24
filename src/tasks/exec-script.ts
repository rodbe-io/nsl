import { join } from 'node:path';
import { execSync } from 'node:child_process';

import chalk from 'chalk';
import { tryCatch } from '@rodbe/fn-utils';

import type { ScriptForInquirer } from '@/models/script.types';
import { getCommandToRun } from '@/helpers/node';
import { rerunCache } from '@/helpers/cache';

type ExecScriptParams = {
  all?: boolean;
  answerSelected: ScriptForInquirer['value'];
  cwd: string;
  debug?: boolean;
  print?: boolean;
  rootPkgManager?: string;
};

export const execScript = ({
  answerSelected,
  cwd,
  debug,
  print,
  rootPkgManager,
}: ExecScriptParams) => {
  const { syncFs } = rerunCache();
  const commandToRun = getCommandToRun({ answerSelected, rootPkgManager });
  const scriptPath =
    answerSelected.folderContainer === 'Root' ? cwd : join(cwd, answerSelected.folderContainer);

  syncFs.setItem(cwd, { answerSelected, rootPkgManager, debug, print, commandToRun });
  console.log(chalk.black.bold.bgGreenBright(commandToRun.root));

  if (debug) {
    console.log({ commandToRun, scriptPath });
  }

  if (print) {
    process.exit(0);
  }

  const [err] = tryCatch(() => {
    execSync(commandToRun.folder, {
      cwd: scriptPath,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  });

  if (err) {
    console.log(chalk.white.bold.bgMagenta(`Ups, try to run the script manually `));
    console.log(commandToRun);
  }
};
