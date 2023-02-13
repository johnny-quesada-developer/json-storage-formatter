export type IValueWithMedaData = {
  $t?: 'map' | 'set' | 'date' | 'regex' | 'error';
  $v?: unknown;
};

/**
 * Deep clone an object, it also suppors Map, Set, Arrays
 * @param obj
 * @returns
 * A deep clone of the object
 * */
export const clone = <T>(obj: T): T => {
  if (isPrimitive(obj) || isDate(obj)) {
    return obj;
  }

  const isArray = Array.isArray(obj);

  if (isArray) {
    return obj.map((item) => clone(item)) as T;
  }

  const isMap = obj instanceof Map;

  if (isMap) {
    const pairs = Array.from(obj.entries());

    return new Map(pairs.map((pair) => clone(pair))) as T;
  }

  const isSet = obj instanceof Set;

  if (isSet) {
    const values = Array.from(obj.values());

    return new Set(values.map((value) => clone(value))) as T;
  }

  const isReg = obj instanceof RegExp;

  if (isReg) {
    return new RegExp(obj.toString()) as T;
  }

  const isError = obj instanceof Error;

  if (isError) {
    return new Error(obj.message) as T;
  }

  const keys = Object.keys(obj as Record<string, unknown>);

  return keys.reduce((acumulator, key) => {
    const value: unknown = obj[key as keyof T];

    return {
      ...acumulator,
      [key]: clone(value),
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
 * Orinal form of the value
 */
export const formatFromStore = <T = unknown>(value: unknown): T => {
  const format = (obj: T & IValueWithMedaData): unknown => {
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

    const keys = Object.keys(obj as Record<string, unknown>);

    return keys.reduce((acumulator, key) => {
      const unformatedValue: unknown = obj[key as keyof T];

      return {
        ...acumulator,
        [key]: formatFromStore(unformatedValue),
      };
    }, {});
  };

  return format(clone(value as T & IValueWithMedaData)) as T;
};

/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays,
 * Returns a new object wich is a clone of the original object with metadata
 * @template {TValue} The type of the value to format
 * @template {TStringify} If the value should be stringified
 * @param {TValue} value The value to format
 * @param {{ stringify: TStringify }} { stringify: boolean } If the value should be stringified
 */
export const formatToStore = <TValue, TStringify extends true | false = false>(
  value: TValue,
  { stringify }: { stringify: TStringify } = { stringify: false as TStringify }
): TStringify extends true ? string : unknown => {
  const format = (obj: TValue): unknown => {
    if (isPrimitive(obj)) {
      return obj;
    }

    const isArray = Array.isArray(obj);

    if (isArray) {
      return (obj as unknown as Array<unknown>).map((item) =>
        formatToStore(item)
      );
    }

    const isMap = obj instanceof Map;

    if (isMap) {
      const pairs = Array.from((obj as Map<unknown, unknown>).entries());

      const value: IValueWithMedaData = {
        $t: 'map',
        $v: pairs.map((pair) => formatToStore(pair)),
      };

      return value;
    }

    const isSet = obj instanceof Set;

    if (isSet) {
      const values = Array.from((obj as Set<unknown>).values());

      const value: IValueWithMedaData = {
        $t: 'set',
        $v: values.map((item) => formatToStore(item)),
      };

      return value;
    }

    if (isDate(obj)) {
      const value: IValueWithMedaData = {
        $t: 'date',
        $v: (obj as Date).toISOString(),
      };

      return value;
    }

    if (isRegex(obj)) {
      const value: IValueWithMedaData = {
        $t: 'regex',
        $v: (obj as RegExp).toString(),
      };

      return value;
    }

    const isError = obj instanceof Error;

    if (isError) {
      const value: IValueWithMedaData = {
        $t: 'error',
        $v: (obj as Error).message,
      };

      return value;
    }

    const keys = Object.keys(obj as Record<string, unknown>);

    return keys.reduce((acumulator, key) => {
      const prop = obj[key as keyof TValue];

      return {
        ...acumulator,
        [key]: formatToStore(prop),
      };
    }, {});
  };

  const objectWithMetadata = format(clone(value));

  const result = stringify
    ? JSON.stringify(objectWithMetadata)
    : objectWithMetadata;

  return result as TStringify extends true ? string : unknown;
};
