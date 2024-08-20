import { describe, expect, it } from 'vitest';

import { pipe, compose } from './fp';

const add2 = (a: number): number => a + 2;
const mult10 = (a: number): number => a * 10;
const subtract5 = (a: number): number => a - 5;

const shout = (text: string) => `${text}!`;
const sayHi = (text: string) => `Hi ${text}`;
const toUpper = (text: string) => text.toUpperCase();

describe('pipe', () => {
  it('should pipe exec functions from left to right', () => {
    const pipedFunction = pipe(add2, mult10, subtract5);
    const result1 = pipedFunction(10);

    expect(result1).toBe(115);
  });

  it('should pipe exec functions from left to right', () => {
    const pipedFunction = pipe(toUpper, sayHi, shout);
    const result1 = pipedFunction('Lolo');

    expect(result1).toBe('Hi LOLO!');
  });
});

describe('compose', () => {
  it('should compose multiple functions from right to left', () => {
    const composedFunction = compose(subtract5, mult10, add2);
    const result1 = composedFunction(10);

    expect(result1).toBe(115);
  });

  it('should compose multiple functions from right to left', () => {
    const composedFunction = compose(toUpper, sayHi, shout);
    const result1 = composedFunction('Lolo');

    expect(result1).toBe('HI LOLO!');
  });
});
