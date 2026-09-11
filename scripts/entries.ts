import path from 'node:path';

const srcDir = path.resolve(__dirname, '..', 'src');

/**
 * Every published entry point.
 * `name` is the emitted file base name (also the subpath / package.json exports key).
 * `source` is the TypeScript source file the entry is bundled from.
 */
export type Entry = {
  name: string;
  source: string;
};

const names = [
  'index',
  'isNil',
  'isNumber',
  'isBoolean',
  'isString',
  'isDate',
  'isRegex',
  'isFunction',
  'isPrimitive',
  'types',
  'formatFromStore',
  'formatToStore',
];

export const entries: Entry[] = names.map((name) => ({
  name,
  source: path.join(srcDir, `${name}.ts`),
}));

/** The root entry (`.` in package.json exports) is emitted as `bundle.*`. */
export const ROOT_ENTRY = 'index';
export const ROOT_OUTPUT = 'bundle';

export const outputBaseName = (name: string): string => (name === ROOT_ENTRY ? ROOT_OUTPUT : name);
