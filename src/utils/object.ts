import { purge } from './array';

export const getProp =
  <T extends object, K extends keyof T>(key: string) =>
  (obj: T): T[K] | string | undefined => {
    const props = purge(key.trim().split('.'));

    if (props.length === 1) {
      return obj[props[0] as K];
    }

    return props.reduce((acc, prop) => (acc as T)[prop as K], obj as any);
  };

type FuzzySearch<T> = {
  items: Array<T>;
  key: string;
  searchText: string;
};
export const fuzzySearch = <T extends object>({ searchText, items, key }: FuzzySearch<T>): Array<T> => {
  const searches = searchText.split(' ');
  let filtered = structuredClone(items);

  searches.forEach(text => {
    // eslint-disable-next-line security-node/non-literal-reg-expr
    const regExp = new RegExp(`(${text.toLowerCase()})`);
    filtered = filtered.filter(item => {
      const textToMatch = getProp(key)(item)?.toLowerCase() || '';

      return regExp.test(textToMatch);
    });
  });

  return filtered;
};
