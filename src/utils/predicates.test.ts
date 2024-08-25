import { describe, expect, it } from 'vitest';

import { hasValue, isEmptyObj, isObject } from './predicates';

describe('hasValue', () => {
  it('should return true if value is not null, undefined, NaN, empty string', () => {
    expect(hasValue(1)).toBe(true);
    expect(hasValue('Hi')).toBe(true);
  });

  it('should return false if value is null, undefined, NaN, empty string', () => {
    expect(hasValue(null)).toBe(false);
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(NaN)).toBe(false);
    expect(hasValue('')).toBe(false);
  });
});

describe('isObject', () => {
  it('should return true if value is object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ name: 'Kevin' })).toBe(true);
  });

  it('should return false if value is not object', () => {
    expect(isObject(1)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(NaN)).toBe(false);
  });
});

describe('isEmptyObj', () => {
  it('should return true if value is empty object', () => {
    expect(isEmptyObj({})).toBe(true);
  });

  it('should return false if value is not empty object', () => {
    expect(isEmptyObj({ name: 'Kevin' })).toBe(false);
  });
});
