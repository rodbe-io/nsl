import { LRUCache } from 'lru-cache';
// import envPaths from 'env-paths';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';

import { readFile } from '@/utils/fs';

export const getCacheFilePath = (cacheName: string) => {
  // return envPaths(cacheName).cache;
  const nslHomePath = `${homedir()}/.nsl`;
  if (!existsSync(nslHomePath)) {
    mkdirSync(nslHomePath);
  }

  return `${homedir()}/.nsl/${cacheName}`;
};

type CacheFactoryParams<Key extends string, Value extends {}, FC> = LRUCache.Options<Key, Value, FC> & {
  cacheName: string;
};
export const cacheFactory = <Value extends {}, FC>(opts: CacheFactoryParams<string, Value, FC>) => {
  const cache = new LRUCache(opts);
  const cacheFilePath = getCacheFilePath(opts.cacheName);
  cache.load(readFile(cacheFilePath));
  const purged = cache.purgeStale();

  const dumpCache = () => {
    writeFileSync(cacheFilePath, JSON.stringify(cache.dump(), null, 2));
  };

  if (purged) {
    dumpCache();
  }

  const clearCache = () => {
    cache.clear();
    dumpCache();
  };

  const deleteCache = (key: string) => {
    cache.delete(key);
    dumpCache();
  };

  const getCache = (key: string) => {
    return cache.get(key);
  };

  const setCache = (key: string, value: any) => {
    cache.set(key, value);
    dumpCache();
  };

  return {
    clearCache,
    deleteCache,
    getCache,
    setCache,
  };
};
