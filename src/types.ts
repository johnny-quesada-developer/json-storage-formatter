export type IValueWithMetaData = {
  $t?: 'map' | 'set' | 'date' | 'regex' | 'error' | 'function';
  $v?: unknown;
};

export type TPrimitives =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'object';