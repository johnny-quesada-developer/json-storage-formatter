
/**
 * Check if a value is a boolean
 * @param value
 * @returns
 * true if the value is a boolean
 * false otherwise
 * */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
