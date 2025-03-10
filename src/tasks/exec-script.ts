import { join } from 'node:path';
import { execSync } from 'node:child_process';

import chalk from 'chalk';
import { tryCatch } from '@rodbe/fn-utils';

import type { ScriptForInquirer } from '@/models/script.types';
import { getCommandToRun } from '@/helpers/node';
import { rerunCache } from '@/helpers/cache';

type ExecScriptParamss = {
  all?: boolean;
  answer: ScriptForInquirer['value'];
  cwd: string;
  debug?: boolean;
  print?: boolean;
  rootPkgManager?: string;
};

export const execScript = ({ answer, cwd, debug, print, rootPkgManager }: ExecScriptParamss) => {
  const { syncFs } = rerunCache();
  syncFs.setItem(cwd, { ...answer, rootPkgManager, debug, print });
  const commandToRun = getCommandToRun(answer, rootPkgManager);
  const scriptPath = answer.folderContainer === 'Root' ? cwd : join(cwd, answer.folderContainer);
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
