export type IValueWithMetaData = {
  $t?: 'map' | 'set' | 'date' | 'regex' | 'error' | 'function';
  $v?: unknown;
};

/**
 * Deep clone an object, it also suppors Map, Set, Arrays
 * @param value
 * @returns
 * A deep clone of the object
 * */
export const clone = <T>(
  value: T,
  {
    shallow,
  }: {
    /**
     * If true, it will only clone the first level of the object
     */
    shallow?: boolean;
  } = {}
): T => {
  if (isPrimitive(value) || isDate(value)) {
    return value;
  }

  const isArray = Array.isArray(value);

  if (isArray) {
    if (shallow) return [...value] as T;

    return value.map((item) => clone(item)) as T;
  }

  const isMap = value instanceof Map;

  if (isMap) {
    const pairs = Array.from(value.entries());

    if (shallow) return new Map(pairs) as T;

    return new Map(pairs.map((pair) => clone(pair))) as T;
  }

  const isSet = value instanceof Set;

  if (isSet) {
    const values = Array.from(value.values());

    if (shallow) return new Set(values) as T;

    return new Set(values.map(($value) => clone($value))) as T;
  }

  const isReg = value instanceof RegExp;

  if (isReg) {
    return new RegExp(value.toString()) as T;
  }

  if (isFunction(value)) {
    if (shallow) return value;

    return Object.create(value as object);
  }

  // if shallow is true, we just return a copy of the object
  if (shallow) return { ...value } as T;

  const isError = value instanceof Error;

  if (isError) {
    return new Error(value.message) as T;
  }

  const keys = Object.keys(value as Record<string, unknown>);

  return keys.reduce((accumulator, key) => {
    const $value: unknown = value[key as keyof T];

    return {
      ...accumulator,
      [key]: clone($value),
    };
  }, {}) as T;
};

/**
 * Check if a value is null or undefined
 * @param value
 * @returns
 * true if the value is null or undefined
 * false otherwise
 * */
export const isNil = (value: unknown) => value === null || value === undefined;

/**
 * Check if a value is a number
 * @param value
 * @returns
 *  true if the value is a number
 * false otherwise
 *  */
export const isNumber = (value: unknown) => typeof value === 'number';

/**
 * Check if a value is a boolean
 * @param value
 * @returns
 * true if the value is a boolean
 * false otherwise
 * */
export const isBoolean = (value: unknown) => typeof value === 'boolean';

/**
 * Check if a value is a string
 * @param value
 * @returns
 * true if the value is a string
 * false otherwise
 * */
export const isString = (value: unknown) => typeof value === 'string';

/** Check if a value is a Date
 * @param value
 * @returns
 * true if the value is a Date
 * false otherwise
 */
export const isDate = (value: unknown) => value instanceof Date;

/**
 * Check if a value is a RegExp
 * @param value The value to check
 * @returns true if the value is a RegExp, false otherwise
 * */
export const isRegex = (value: unknown) => value instanceof RegExp;

/**
 * Check if a value is a function
 * @param value The value to check
 * @returns true if the value is a function, false otherwise
 * */
export const isFunction = (value: unknown) =>
  typeof value === 'function' || value instanceof Function;

/**
 * Check if a value is a primitive
 * @param value
 * @returns
 * true if the value is a primitive
 * false otherwise
 * null, number, boolean, string, symbol
 */
export const isPrimitive = (value: unknown) =>
  isNil(value) ||
  isNumber(value) ||
  isBoolean(value) ||
  isString(value) ||
  typeof value === 'symbol';

/**
 * Format an value with possible metadata to his original form, it also supports Map, Set, Arrays
 * @param value
 * @returns
 * Original form of the value
 */
export const formatFromStore = <T = unknown>(
  value: unknown,
  {
    jsonParse,
    sortKeys,
  }: {
    /** If the value should be parsed from json before formatting */
    jsonParse?: boolean;
    sortKeys?: boolean | ((a: string, b: string) => number);
  } = {}
): T => {
  const format = (obj: T & IValueWithMetaData): unknown => {
    if (isPrimitive(obj)) {
      return obj;
    }

    const isMetaDate = obj?.$t === 'date';

    if (isMetaDate) {
      return new Date(obj.$v as string);
    }

    const isMetaMap = obj?.$t === 'map';

    if (isMetaMap) {
      const mapData: [string, unknown][] = (
        ((obj.$v as []) ?? []) as [string, unknown][]
      ).map(([key, item]) => [key, formatFromStore(item)]);

      return new Map(mapData);
    }

    const isMetaSet = obj?.$t === 'set';

    if (isMetaSet) {
      const setData: unknown[] =
        (obj.$v as []) ?? [].map((item) => formatFromStore(item));

      return new Set(setData);
    }

    const isMetaReg = obj?.$t === 'regex';

    if (isMetaReg) {
      return new RegExp(obj.$v as string);
    }

    const isMetaError = obj?.$t === 'error';

    if (isMetaError) {
      return new Error(obj.$v as string);
    }

    const isArray = Array.isArray(obj);

    if (isArray) {
      return (obj as unknown as Array<unknown>).map((item) =>
        formatFromStore(item)
      );
    }

    const isMetaFunction = obj?.$t === 'function';

    if (isMetaFunction) {
      // return a function that calls the original function
      return Function(`(${obj.$v})(...arguments)`);
    }

    const keys = (() => {
      const _keys = Object.keys(obj as Record<string, unknown>);

      if (!sortKeys) return _keys;

      if (isFunction(sortKeys))
        return _keys.sort(sortKeys as (a: string, b: string) => number);

      return _keys.sort((a, b) => (a ?? '').localeCompare(b));
    })();

    return keys.reduce((accumulator, key) => {
      const unformattedValue: unknown = obj[key as keyof T];

      return {
        ...accumulator,
        [key]: formatFromStore(unformattedValue),
      };
    }, {});
  };

  const value$ = jsonParse
    ? JSON.parse(value as string)
    : clone(value as T & IValueWithMetaData);

  return format(value$) as T;
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

/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays,
 * Returns a new object which is a clone of the original object with metadata
 * @template {TValue} The type of the value to format
 * @template {TStringify} If the value should be stringified
 * @param {TValue} value The value to format
 * @param {{ stringify: TStringify }} { stringify: boolean } If the value should be stringified
 */
export const formatToStore = <TValue, TStringify extends true | false = false>(
  value: TValue,
  {
    stringify,
    validator,
    excludeTypes,
    excludeKeys,
    sortKeys,
  }: {
    stringify?: TStringify;
    excludeTypes?: TPrimitives[] | Set<TPrimitives>;
    excludeKeys?: string[] | Set<string>;
    sortKeys?: boolean | ((a: string, b: string) => number);
    /**
     * Returns true if the value should be included in the stringified version,
     * if provided it will override the default validator and the excludesTypes and excludeKeys
     */
    validator?: ({
      obj,
      key,
      value,
    }: {
      obj: unknown;
      key: string;
      value: any;
    }) => boolean | undefined;
  } = { stringify: false as TStringify }
): TStringify extends true ? string : unknown => {
  const $excludesTypes = new Set(excludeTypes ?? []);
  const $excludeKeys = new Set(excludeKeys ?? []);
  const hasDefaultValidator = $excludesTypes.size || $excludeKeys.size;

  const $validator =
    validator ??
    (({
      key,
      value: $value,
    }: {
      obj: unknown;
      key: string;
      value: any;
    }): boolean => {
      if (!hasDefaultValidator) return true;

      const isExcludedKey = $excludeKeys.has(key);
      const isExcludedType = $excludesTypes.has(typeof $value);

      return !isExcludedKey && !isExcludedType;
    });

  const format = <T>(obj: T): unknown => {
    if (isPrimitive(obj)) {
      return obj;
    }

    const isArray = Array.isArray(obj);

    if (isArray) {
      return (obj as unknown as Array<unknown>).map((item) => format(item));
    }

    const isMap = obj instanceof Map;

    if (isMap) {
      const pairs = Array.from((obj as Map<unknown, unknown>).entries());

      const value: IValueWithMetaData = {
        $t: 'map',
        $v: pairs.map((pair) => format(pair)),
      };

      return value;
    }

    const isSet = obj instanceof Set;

    if (isSet) {
      const values = Array.from((obj as Set<unknown>).values());

      const value: IValueWithMetaData = {
        $t: 'set',
        $v: values.map((item) => format(item)),
      };

      return value;
    }

    if (isDate(obj)) {
      const value: IValueWithMetaData = {
        $t: 'date',
        $v: (obj as Date).toISOString(),
      };

      return value;
    }

    if (isRegex(obj)) {
      const value: IValueWithMetaData = {
        $t: 'regex',
        $v: (obj as RegExp).toString(),
      };

      return value;
    }

    if (isFunction(obj)) {
      let value: IValueWithMetaData;

      try {
        value = {
          $t: 'function',
          $v: obj.toString(),
        };
      } catch (error) {
        value = {
          $t: 'error',
          $v: 'Error: Could not serialize function',
        };
      }

      return value;
    }

    const isError = obj instanceof Error;

    if (isError) {
      const value: IValueWithMetaData = {
        $t: 'error',
        $v: (obj as Error).message,
      };

      return value;
    }

    const keys = (() => {
      const _keys = Object.keys(obj as Record<string, unknown>);

      if (!sortKeys) return _keys;

      if (isFunction(sortKeys))
        return _keys.sort(sortKeys as (a: string, b: string) => number);

      return _keys.sort((a, b) => (a ?? '').localeCompare(b));
    })();

    return keys.reduce((accumulator, key) => {
      const prop = obj[key as keyof T];
      const propValue = format(prop);
      const shouldInclude = $validator({
        obj,
        key,
        value: propValue,
      });

      if (!shouldInclude) return accumulator;

      return {
        ...accumulator,
        [key]: format(prop),
      };
    }, {});
  };

  const objectWithMetadata = format(clone(value));

  const result = stringify
    ? JSON.stringify(objectWithMetadata)
    : objectWithMetadata;

  return result as TStringify extends true ? string : unknown;
};
