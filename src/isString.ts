
/**
 * Check if a value is a string
 * @param value
 * @returns
 * true if the value is a string
 * false otherwise
 * */
export const isString = (value: unknown): value is string => typeof value === 'string';
