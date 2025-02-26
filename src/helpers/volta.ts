import { execSync } from 'node:child_process';

import { tryCatch } from '@rodbe/fn-utils';

export const voltaExists = () => {
  const [err] = tryCatch(() => {
    execSync('volta --version', { stdio: 'ignore' });

    return true;
  });

  return !err;
};
