import { clone } from "./clone";
import { isDate } from "./isDate";
import { isFunction } from "./isFunction";
import { isPrimitive } from "./isPrimitive";
import { isRegex } from "./isRegex";
import { IValueWithMetaData, TPrimitives } from "./types";

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
      value: unknown;
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
      value: unknown;
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
