import isDate from './isDate';
import isFunction from './isFunction';
import isPrimitive from './isPrimitive';
import isRegex from './isRegex';
import type { EnvelopData, Primitives } from './types';

/**
 * Formats an object to be stored, it adds metadata to preserve data types
 * Compatible with Map, Set, Date, RegExp, Function, Error
 * * @param value The value to format
 * @param options Formatting options
 * @param options.excludeTypes An array or set of primitive types to exclude from the stringified version
 * @param options.excludeKeys An array or set of keys to exclude from the stringified version
 * @param options.sortKeys If true, it will sort the keys of the object alphabetically, or a function to sort the keys,
 * This helps to guarantee a consistent order of the keys in the stringified version
 * @param options.validator Returns true if the value should be included in the stringified version,
 * if provided it will override the default validator and the excludesTypes and excludeKeys
 * @returns A stringified version of the object with metadata
 */
const formatToStore = <T>(
  value: T,
  options: {
    /**
     * If true, it will return a stringified version of the object
     */
    excludeTypes?: Primitives[] | Set<Primitives>;

    /**
     * An array or set of keys to exclude from the stringified version
     */
    excludeKeys?: string[] | Set<string>;

    /**
     * If true, it will sort the keys of the object alphabetically, or a function to sort the keys,
     * This helps to guarantee a consistent order of the keys in the stringified version
     */
    sortKeys?: boolean | ((a: string, b: string) => number);

    /**
     * Returns true if the value should be included in the stringified version,
     * if provided it will override the default validator and the excludesTypes and excludeKeys
     */
    validator?: ({ obj, key, value }: { obj: unknown; key: string; value: unknown }) => boolean | undefined;
  } = {},
): string => {
  const $excludesTypes = new Set(options.excludeTypes ?? []);
  const $excludeKeys = new Set(options.excludeKeys ?? []);
  const hasDefaultValidator = $excludesTypes.size || $excludeKeys.size;

  const $validator =
    options.validator ??
    (({ key, value: $value }: { obj: unknown; key: string; value: unknown }): boolean => {
      if (!hasDefaultValidator) return true;

      const isExcludedKey = $excludeKeys.has(key);
      const isExcludedType = $excludesTypes.has(typeof $value);

      return !isExcludedKey && !isExcludedType;
    });

  const format = <T>(value$: T): unknown => {
    if (value$ === undefined) {
      return {
        $t: 'undefined',
      };
    }

    if (isPrimitive(value$)) {
      return value$;
    }

    const isArray = Array.isArray(value$);

    if (isArray) {
      return (value$ as unknown as Array<unknown>).map((item) => format(item));
    }

    const isMap = value$ instanceof Map;

    if (isMap) {
      const pairs = Array.from((value$ as Map<unknown, unknown>).entries());

      const envelop: EnvelopData = {
        $t: 'map',
        $v: pairs.map((pair) => format(pair)),
      };

      return envelop;
    }

    const isSet = value$ instanceof Set;

    if (isSet) {
      const envelop: EnvelopData = {
        $t: 'set',
        $v: Array.from((value$ as Set<unknown>).values()).map((item) => format(item)),
      };

      return envelop;
    }

    if (isDate(value$)) {
      const envelop: EnvelopData = {
        $t: 'date',
        $v: (value$ as Date).toISOString(),
      };

      return envelop;
    }

    if (isRegex(value$)) {
      const envelop: EnvelopData = {
        $t: 'regex',
        $v: {
          s: value$.source,
          f: value$.flags,
        },
      };

      return envelop;
    }

    if (isFunction(value$)) {
      let envelop: EnvelopData;

      try {
        envelop = {
          $t: 'function',
          $v: value$.toString(),
        };
      } catch (error) {
        envelop = {
          $t: 'error',
          $v: `Could not serialize function: ${(error as Error)?.message}`,
        };
      }

      return envelop;
    }

    const isError = value$ instanceof Error;

    if (isError) {
      const envelop: EnvelopData = {
        $t: 'error',
        $v: (value$ as Error).message,
      };

      return envelop;
    }

    const keys = (() => {
      const _keys = Object.keys(value$ as Record<string, unknown>);

      if (!options.sortKeys) return _keys;

      if (isFunction(options.sortKeys))
        return _keys.sort(options.sortKeys as (a: string, b: string) => number);

      return _keys.sort((a, b) => a.localeCompare(b));
    })();

    return keys.reduce((accumulator, key) => {
      const propValue = value$[key as keyof T];
      const formattedPropValue = format(propValue);
      const shouldInclude = $validator({
        obj: value$,
        key,
        value: formattedPropValue,
      });

      if (!shouldInclude) return accumulator;

      return {
        ...accumulator,
        [key]: format(propValue),
      };
    }, {});
  };

  const objectWithMetadata = format(value);

  return JSON.stringify(objectWithMetadata);
};

export default formatToStore;
