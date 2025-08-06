#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

import {} from '@rodbe/fn-utils';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
delete pkg.volta;
delete pkg.packageManager;

writeFileSync('package.json', JSON.stringify(pkg, null, 2));
