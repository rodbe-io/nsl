import { fsCache } from '@rodbe/lru-cache-fs';

import { RERUN_CACHE_NAME, QUATER_IN_MS } from '@/constants';
import { nslCachePath } from './nsl';
import type { ScriptForInquirer } from '@/models/script.types';

type ValueToSave = ScriptForInquirer['value'] & {
  debug?: boolean;
  print?: boolean;
  rootPkgManager?: string;
};

export const rerunCache = (): ReturnType<typeof fsCache<string, ValueToSave, any>> => {
  return fsCache<string, ValueToSave, any>({
    cacheName: RERUN_CACHE_NAME,
    cachePath: nslCachePath,
    max: 200,
    ttl: QUATER_IN_MS,
  });
};
