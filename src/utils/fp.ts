type Func = (...args: any) => any;

export const pipe = <FirstFunc extends Func, RestFunc extends Func[], LastFunc extends Func>(
  ...fns: [FirstFunc, ...RestFunc, LastFunc]
): ((...args: Parameters<FirstFunc>) => ReturnType<LastFunc>) =>
  fns.reduce(
    (acc, currentFunc) =>
      (...args: [...Parameters<FirstFunc>]) =>
        currentFunc(acc(...args))
  );

export const compose = <FirstFunc extends Func, RestFunc extends Func[], LastFunc extends Func>(
  ...fns: [FirstFunc, ...RestFunc, LastFunc]
): ((...args: Parameters<LastFunc>) => ReturnType<FirstFunc>) =>
  fns.reduceRight(
    (acc, currentFunc) =>
      (...args: [...Parameters<LastFunc>]) =>
        currentFunc(acc(...args))
  );
