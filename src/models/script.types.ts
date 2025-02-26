import type { NormalizedScripts, Script } from '@rodbe/get-package-jsons';

export type Config = {
  ignoreScripts: string[];
};

export type ExecScriptParams = {
  all?: boolean;
  debug?: boolean;
  print?: boolean;
};

export type ScriptForInquirer = {
  name: string;
  value: Script & { packageName?: string } & Pick<
      NormalizedScripts[string],
      'packageManager' | 'folderContainer'
    >;
};
