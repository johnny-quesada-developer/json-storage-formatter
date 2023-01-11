type IValueWithMedaData = {
  _type_?: 'map' | 'set' | 'date';
  value?: unknown;
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

  const keys = Object.keys(obj as Record<string, unknown>);

  return keys.reduce((acumulator, key) => {
    const value = obj[key as keyof T];

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
export const formatFromStore = <T>(value: T): unknown => {
  const format = (obj: T & IValueWithMedaData): unknown => {
    if (isPrimitive(obj)) {
      return obj;
    }

    const isMetaDate = obj?._type_ === 'date';

    if (isMetaDate) {
      return new Date(obj.value as string);
    }

    const isMetaMap = obj?._type_ === 'map';

    if (isMetaMap) {
      const mapData: [string, unknown][] = (
        ((obj.value as []) ?? []) as [string, unknown][]
      ).map(([key, item]) => [key, formatFromStore(item)]);

      return new Map(mapData);
    }

    const isMetaSet = obj?._type_ === 'set';

    if (isMetaSet) {
      const setData: unknown[] =
        (obj.value as []) ?? [].map((item) => formatFromStore(item));

      return new Set(setData);
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

  return format(clone(value as T & IValueWithMedaData));
};

/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays
 * @returns
 * A value with metadata to store it as json
 */
export const formatToStore = <T>(value: T): unknown => {
  const format = (obj: T): unknown => {
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

      return {
        _type_: 'map',
        value: pairs.map((pair) => formatToStore(pair)),
      };
    }

    const isSet = obj instanceof Set;

    if (isSet) {
      const values = Array.from((obj as Set<unknown>).values());

      return {
        _type_: 'set',
        value: values.map((item) => formatToStore(item)),
      };
    }

    if (isDate(obj)) {
      return {
        _type_: 'date',
        value: (obj as Date).toISOString(),
      };
    }

    const keys = Object.keys(obj as Record<string, unknown>);

    return keys.reduce((acumulator, key) => {
      const prop = obj[key as keyof T];

      return {
        ...acumulator,
        [key]: formatToStore(prop),
      };
    }, {});
  };

  return format(clone(value));
};
