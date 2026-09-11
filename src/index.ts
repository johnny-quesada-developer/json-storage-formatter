export { isNil } from './isNil';
export { isNumber } from './isNumber';
export { isBoolean } from './isBoolean';
export { isString } from './isString';
export { isDate } from './isDate';
export { isRegex } from './isRegex';
export { isFunction } from './isFunction';
export { isPrimitive } from './isPrimitive';
export { formatFromStore } from './formatFromStore';
export { formatToStore } from './formatToStore';
export type { Primitives, EnvelopData } from './types';

import { isNil } from './isNil';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isString } from './isString';
import { isDate } from './isDate';
import { isRegex } from './isRegex';
import { isFunction } from './isFunction';
import { isPrimitive } from './isPrimitive';
import { formatFromStore } from './formatFromStore';
import { formatToStore } from './formatToStore';

const jsonStorageFormatter = {
  isNil,
  isNumber,
  isBoolean,
  isString,
  isDate,
  isRegex,
  isFunction,
  isPrimitive,
  formatFromStore,
  formatToStore,
};

export default jsonStorageFormatter;
