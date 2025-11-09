/**
 * Check if a value is a number
 * @param value
 * @returns
 *  true if the value is a number
 * false otherwise
 *  */
const isNumber = (value: unknown): value is number => typeof value === 'number';

export default isNumber;
