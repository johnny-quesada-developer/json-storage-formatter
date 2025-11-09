/**
 * Check if a value is a string
 * @param value
 * @returns
 * true if the value is a string
 * false otherwise
 * */
const isString = (value: unknown): value is string => typeof value === 'string';

export default isString;
