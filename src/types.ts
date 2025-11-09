export type EnvelopData = {
  $t: 'map' | 'set' | 'date' | 'regex' | 'error' | 'function' | 'undefined';
  $v: unknown;
};

export type Primitives =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'object';
