import { hasValue } from './predicates';

export const purge = <T>(array: Array<T>): Array<T> => array.filter(hasValue);
