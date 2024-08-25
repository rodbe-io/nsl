import { describe, expect, it } from 'vitest';

import { getProp, fuzzySearch } from './object';

const obj1 = {
  name: 'Kevin',
  age: 30,
  do: {
    re: {
      mi: {
        fa: 123,
      },
    },
  },
};

const obj2 = {
  do: {
    re: {
      mi: {
        fa: 'asd',
      },
    },
  },
};

describe('getProp', () => {
  it('should get prop from first level', () => {
    const result = getProp('name')(obj1);

    expect(result).toBe('Kevin');
  });

  it('should get prop from nested level', () => {
    const result = getProp('do.re.mi.fa')(obj1);

    expect(result).toBe(123);
  });

  it('should get obj prop from nested level', () => {
    const result = getProp('do.re.mi')(obj1);

    expect(result).toEqual(obj1.do.re.mi);
  });
});

describe('fuzzySearch', () => {
  it('should fuzzy search return a object', () => {
    const result = fuzzySearch({ searchText: 'kevin', items: [obj1], key: 'name' });
    console.log(11, result);
    expect(result).toEqual([obj1]);
  });

  it('should fuzzy search return empty array', () => {
    const result = fuzzySearch({ searchText: 'lorem', items: [obj1], key: 'do.re.mi.fa' });

    expect(result).toEqual([]);
  });

  it('should fuzzy search return nested prop match', () => {
    const result = fuzzySearch({ searchText: 'asd', items: [obj1, obj2], key: 'do.re.mi.fa' });

    expect(result).toEqual([obj2]);
  });
});
