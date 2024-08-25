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
