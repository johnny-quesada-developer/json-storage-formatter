import isString from './isString';
import isPrimitive from './isPrimitive';
import type { EnvelopData } from './types';

/**
 * Format an value with possible metadata to his original form, it also supports Map, Set, Arrays
 * @param value
 * @returns
 * Original form of the value
 */
const formatFromStore = <T = unknown>(value: string): T => {
  if (!isString(value)) return value as T;

  const format = (obj: unknown): unknown => {
    if (!isObject(obj)) {
      return obj;
    }

    const isMetaUndefined = obj?.$t === 'undefined';

    if (isMetaUndefined) {
      return undefined;
    }

    const isMetaDate = obj?.$t === 'date';

    if (isMetaDate) {
      return new Date(obj.$v as string);
    }

    const isMetaMap = obj?.$t === 'map';

    if (isMetaMap) {
      const mapData: [string, unknown][] = (((obj.$v as []) ?? []) as [string, unknown][]).map(
        ([key, item]) => [key, format(item)],
      );

      return new Map(mapData);
    }

    const isMetaSet = obj?.$t === 'set';

    if (isMetaSet) {
      const setData: unknown[] = ((obj.$v as []) ?? []).map((item) => {
        return format(item);
      });

      return new Set(setData);
    }

    const isMetaReg = obj?.$t === 'regex';

    if (isMetaReg) {
      const envelop = obj.$v as { s: string; f: string };

      return new RegExp(envelop.s, envelop.f);
    }

    const isMetaError = obj?.$t === 'error';

    if (isMetaError) {
      return new Error(obj.$v as string);
    }

    const isArray = Array.isArray(obj);

    if (isArray) {
      return (obj as unknown as Array<unknown>).map((item) => format(item));
    }

    const isMetaFunction = obj?.$t === 'function';

    if (isMetaFunction) {
      // return a function that calls the original function
      return Function(`(${obj.$v})(...arguments)`);
    }

    const keys = Object.keys(obj as Record<string, unknown>);

    return keys.reduce((accumulator, key) => {
      const unformattedValue = obj[key];

      return {
        ...accumulator,
        [key]: format(unformattedValue),
      };
    }, {});
  };

  return format(JSON.parse(value)) as T;
};

const isObject = (value: unknown): value is Record<string, unknown> & Partial<EnvelopData> => {
  return !isPrimitive(value);
};

export default formatFromStore;
