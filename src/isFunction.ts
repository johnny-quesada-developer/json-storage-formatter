/**
 * Check if a value is a function
 * @param value The value to check
 * @returns true if the value is a function, false otherwise
 * */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFunction = <T extends (...args: any[]) => any>(value: unknown): value is NonNullable<T> =>
  typeof value === 'function' || value instanceof Function;

export default isFunction;
