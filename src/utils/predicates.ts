export const hasValue = (v: any) => ![null, undefined, NaN, ''].includes(v);

export const isObject = (value: unknown): value is object =>
  Object.prototype.toString.call(value) === '[object Object]';

export const isEmptyObj = (obj: unknown) => {
  if (!isObject(obj)) {
    return true;
  }

  return !Object.keys(obj).length;
};
