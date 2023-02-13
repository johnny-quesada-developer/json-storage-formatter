export type IValueWithMedaData = {
    $t?: 'map' | 'set' | 'date' | 'regex' | 'error';
    $v?: unknown;
};
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
 * Check if a value is a RegExp
 * @param value The value to check
 * @returns true if the value is a RegExp, false otherwise
 * */
export declare const isRegex: (value: unknown) => boolean;
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
export declare const formatFromStore: <T = unknown>(value: unknown) => T;
/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays,
 * Returns a new object wich is a clone of the original object with metadata
 * @template {TValue} The type of the value to format
 * @template {TStringify} If the value should be stringified
 * @param {TValue} value The value to format
 * @param {{ stringify: TStringify }} { stringify: boolean } If the value should be stringified
 */
export declare const formatToStore: <TValue, TStringify extends boolean = false>(value: TValue, { stringify }?: {
    stringify: TStringify;
}) => TStringify extends true ? string : unknown;
//# sourceMappingURL=json-storage-formatter.d.ts.map