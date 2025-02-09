import { isDate } from "./isDate";
import { isFunction } from "./isFunction";
import { isPrimitive } from "./isPrimitive";

/**
 * Deep clone an object, it also support Map, Set, Arrays
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
