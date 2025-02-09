import { clone } from "./clone";
import { isFunction } from "./isFunction";
import { isPrimitive } from "./isPrimitive";
import { IValueWithMetaData } from "./types";

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



