import isBoolean from './isBoolean';
import isNil from './isNil';
import isNumber from './isNumber';
import isString from './isString';

/**
 * Check if a value is a primitive
 * @param value
 * @returns
 * true if the value is a primitive
 * false otherwise
 * null, number, boolean, string, symbol
 */
const isPrimitive = (value: unknown): value is null | number | boolean | string | symbol =>
  isNil(value) || isNumber(value) || isBoolean(value) || isString(value) || typeof value === 'symbol';

export default isPrimitive;
