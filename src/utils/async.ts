import { isObject } from './predicates';

export const to = async <T, E>(
  promise: Promise<T>,
  errInfo?: E
): Promise<[null, T] | [E extends string ? Error & { errInfo: string } : Error & E, null]> => {
  try {
    const res = await promise;

    return [null, res];
  } catch (err) {
    if (errInfo && err instanceof Error) {
      if (typeof errInfo === 'string') {
        Object.assign(err, { errInfo });
      }
      if (isObject(errInfo)) {
        Object.assign(err, errInfo);
      }
    }

    return [err as E extends string ? Error & { errInfo: string } : Error & E, null];
  }
};
