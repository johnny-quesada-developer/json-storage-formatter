/**
 * Check if a value is a boolean
 * @param value
 * @returns
 * true if the value is a boolean
 * false otherwise
 * */
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export default isBoolean;
