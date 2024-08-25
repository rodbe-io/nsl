import { describe, expect, it } from 'vitest';

import { readFile } from './fs';

describe('readFile', () => {
  it('should read file with empty file', () => {
    const filePath = `${process.cwd()}/empty.json`;
    const result = readFile(filePath);
    console.log(result);
    expect(result).toEqual(null);
  });
});

describe('getAllScriptsFromPackageJsons', () => {
  it('should read prop name from package.json', () => {
    const filePath = `${process.cwd()}/package.json`;
    const result = readFile(filePath);

    expect(result.name).toBe('@rodbe/nsl');
  });
});
