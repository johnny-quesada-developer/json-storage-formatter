/**
 * Deep clone an object, it also suppors Map, Set, Arrays
 * @param obj
 * @returns
 * A deep clone of the object
 * */
export declare const clone: <T>(obj: T) => T;
/**
 * Check if a value is null or undefined
 * @param value
 * @returns
 * true if the value is null or undefined
 * false otherwise
 * */
export declare const isNil: (value: unknown) => boolean;
/**
 * Check if a value is a number
 * @param value
 * @returns
 *  true if the value is a number
 * false otherwise
 *  */
export declare const isNumber: (value: unknown) => boolean;
/**
 * Check if a value is a boolean
 * @param value
 * @returns
 * true if the value is a boolean
 * false otherwise
 * */
export declare const isBoolean: (value: unknown) => boolean;
/**
 * Check if a value is a string
 * @param value
 * @returns
 * true if the value is a string
 * false otherwise
 * */
export declare const isString: (value: unknown) => boolean;
/** Check if a value is a Date
 * @param value
 * @returns
 * true if the value is a Date
 * false otherwise
 */
export declare const isDate: (value: unknown) => boolean;
/**
 * Check if a value is a primitive
 * @param value
 * @returns
 * true if the value is a primitive
 * false otherwise
 * null, number, boolean, string, symbol
 */
export declare const isPrimitive: (value: unknown) => boolean;
/**
 * Format an value with possible metadata to his original form, it also supports Map, Set, Arrays
 * @param value
 * @returns
 * Orinal form of the value
 */
export declare const formatFromStore: <T>(value: T) => unknown;
/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays
 * @returns
 * A value with metadata to store it as json
 */
export declare const formatToStore: <T>(value: T) => unknown;
//# sourceMappingURL=json-storage-formatter.d.ts.map