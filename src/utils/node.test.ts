import { describe, expect, it } from 'vitest';

import { getPackageManager } from './node';

describe('getPackageManager', () => {
  it('should return npm package runner', () => {
    const packageManager = 'npm@9.5.0';
    const result = getPackageManager(packageManager);

    expect(result).toBe('npm');
  });

  it('should return pnpm package runner', () => {
    const packageManager = 'pnpm@9.5.0';
    const result = getPackageManager(packageManager);

    expect(result).toBe('pnpm');
  });

  it('should return yarn package runner', () => {
    const packageManager = 'yarn@9.5.0';
    const result = getPackageManager(packageManager);

    expect(result).toBe('yarn');
  });

  it('should return bun package runner', () => {
    const packageManager = 'bun@9.5.0';
    const result = getPackageManager(packageManager);

    expect(result).toBe('bun');
  });

  it('should return default package runner', () => {
    const packageManager = 'loremIpsum@9.5.0';
    const result = getPackageManager(packageManager);

    expect(result).toBe('npm');
  });
});
