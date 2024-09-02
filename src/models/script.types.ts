export type Script = {
  value: {
    contentScript: string;
    folderContainer: string;
    packageManager: string;
    scriptName: string;
  };
};

export interface ScriptTable extends Script {
  name: string;
}

export type Config = {
  ignoreScripts: string[];
};

export type ExecScriptParams = {
  all?: boolean;
  debug?: boolean;
};
