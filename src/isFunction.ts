/**
 * Check if a value is a function
 * @param value The value to check
 * @returns true if the value is a function, false otherwise
 * */
export const isFunction = <T extends (...args: Parameters<T>) => ReturnType<T>>(value: unknown): value is NonNullable<T> =>
  typeof value === 'function' || value instanceof Function;
