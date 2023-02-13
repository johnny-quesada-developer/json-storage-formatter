"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToStore = exports.formatFromStore = exports.isPrimitive = exports.isRegex = exports.isDate = exports.isString = exports.isBoolean = exports.isNumber = exports.isNil = exports.clone = void 0;
/**
 * Deep clone an object, it also suppors Map, Set, Arrays
 * @param obj
 * @returns
 * A deep clone of the object
 * */
const clone = (obj) => {
    if ((0, exports.isPrimitive)(obj) || (0, exports.isDate)(obj)) {
        return obj;
    }
    const isArray = Array.isArray(obj);
    if (isArray) {
        return obj.map((item) => (0, exports.clone)(item));
    }
    const isMap = obj instanceof Map;
    if (isMap) {
        const pairs = Array.from(obj.entries());
        return new Map(pairs.map((pair) => (0, exports.clone)(pair)));
    }
    const isSet = obj instanceof Set;
    if (isSet) {
        const values = Array.from(obj.values());
        return new Set(values.map((value) => (0, exports.clone)(value)));
    }
    const isReg = obj instanceof RegExp;
    if (isReg) {
        return new RegExp(obj.toString());
    }
    const isError = obj instanceof Error;
    if (isError) {
        return new Error(obj.message);
    }
    const keys = Object.keys(obj);
    return keys.reduce((acumulator, key) => {
        const value = obj[key];
        return Object.assign(Object.assign({}, acumulator), { [key]: (0, exports.clone)(value) });
    }, {});
};
exports.clone = clone;
/**
 * Check if a value is null or undefined
 * @param value
 * @returns
 * true if the value is null or undefined
 * false otherwise
 * */
const isNil = (value) => value === null || value === undefined;
exports.isNil = isNil;
/**
 * Check if a value is a number
 * @param value
 * @returns
 *  true if the value is a number
 * false otherwise
 *  */
const isNumber = (value) => typeof value === 'number';
exports.isNumber = isNumber;
/**
 * Check if a value is a boolean
 * @param value
 * @returns
 * true if the value is a boolean
 * false otherwise
 * */
const isBoolean = (value) => typeof value === 'boolean';
exports.isBoolean = isBoolean;
/**
 * Check if a value is a string
 * @param value
 * @returns
 * true if the value is a string
 * false otherwise
 * */
const isString = (value) => typeof value === 'string';
exports.isString = isString;
/** Check if a value is a Date
 * @param value
 * @returns
 * true if the value is a Date
 * false otherwise
 */
const isDate = (value) => value instanceof Date;
exports.isDate = isDate;
/**
 * Check if a value is a RegExp
 * @param value The value to check
 * @returns true if the value is a RegExp, false otherwise
 * */
const isRegex = (value) => value instanceof RegExp;
exports.isRegex = isRegex;
/**
 * Check if a value is a primitive
 * @param value
 * @returns
 * true if the value is a primitive
 * false otherwise
 * null, number, boolean, string, symbol
 */
const isPrimitive = (value) => (0, exports.isNil)(value) ||
    (0, exports.isNumber)(value) ||
    (0, exports.isBoolean)(value) ||
    (0, exports.isString)(value) ||
    typeof value === 'symbol';
exports.isPrimitive = isPrimitive;
/**
 * Format an value with possible metadata to his original form, it also supports Map, Set, Arrays
 * @param value
 * @returns
 * Orinal form of the value
 */
const formatFromStore = (value) => {
    const format = (obj) => {
        var _a, _b;
        if ((0, exports.isPrimitive)(obj)) {
            return obj;
        }
        const isMetaDate = (obj === null || obj === void 0 ? void 0 : obj.$t) === 'date';
        if (isMetaDate) {
            return new Date(obj.$v);
        }
        const isMetaMap = (obj === null || obj === void 0 ? void 0 : obj.$t) === 'map';
        if (isMetaMap) {
            const mapData = ((_a = obj.$v) !== null && _a !== void 0 ? _a : []).map(([key, item]) => [key, (0, exports.formatFromStore)(item)]);
            return new Map(mapData);
        }
        const isMetaSet = (obj === null || obj === void 0 ? void 0 : obj.$t) === 'set';
        if (isMetaSet) {
            const setData = (_b = obj.$v) !== null && _b !== void 0 ? _b : [].map((item) => (0, exports.formatFromStore)(item));
            return new Set(setData);
        }
        const isMetaReg = (obj === null || obj === void 0 ? void 0 : obj.$t) === 'regex';
        if (isMetaReg) {
            return new RegExp(obj.$v);
        }
        const isMetaError = (obj === null || obj === void 0 ? void 0 : obj.$t) === 'error';
        if (isMetaError) {
            return new Error(obj.$v);
        }
        const isArray = Array.isArray(obj);
        if (isArray) {
            return obj.map((item) => (0, exports.formatFromStore)(item));
        }
        const keys = Object.keys(obj);
        return keys.reduce((acumulator, key) => {
            const unformatedValue = obj[key];
            return Object.assign(Object.assign({}, acumulator), { [key]: (0, exports.formatFromStore)(unformatedValue) });
        }, {});
    };
    return format((0, exports.clone)(value));
};
exports.formatFromStore = formatFromStore;
/**
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays,
 * Returns a new object wich is a clone of the original object with metadata
 * @template {TValue} The type of the value to format
 * @template {TStringify} If the value should be stringified
 * @param {TValue} value The value to format
 * @param {{ stringify: TStringify }} { stringify: boolean } If the value should be stringified
 */
const formatToStore = (value, { stringify } = { stringify: false }) => {
    const format = (obj) => {
        if ((0, exports.isPrimitive)(obj)) {
            return obj;
        }
        const isArray = Array.isArray(obj);
        if (isArray) {
            return obj.map((item) => (0, exports.formatToStore)(item));
        }
        const isMap = obj instanceof Map;
        if (isMap) {
            const pairs = Array.from(obj.entries());
            const value = {
                $t: 'map',
                $v: pairs.map((pair) => (0, exports.formatToStore)(pair)),
            };
            return value;
        }
        const isSet = obj instanceof Set;
        if (isSet) {
            const values = Array.from(obj.values());
            const value = {
                $t: 'set',
                $v: values.map((item) => (0, exports.formatToStore)(item)),
            };
            return value;
        }
        if ((0, exports.isDate)(obj)) {
            const value = {
                $t: 'date',
                $v: obj.toISOString(),
            };
            return value;
        }
        if ((0, exports.isRegex)(obj)) {
            const value = {
                $t: 'regex',
                $v: obj.toString(),
            };
            return value;
        }
        const isError = obj instanceof Error;
        if (isError) {
            const value = {
                $t: 'error',
                $v: obj.message,
            };
            return value;
        }
        const keys = Object.keys(obj);
        return keys.reduce((acumulator, key) => {
            const prop = obj[key];
            return Object.assign(Object.assign({}, acumulator), { [key]: (0, exports.formatToStore)(prop) });
        }, {});
    };
    const objectWithMetadata = format((0, exports.clone)(value));
    const result = stringify
        ? JSON.stringify(objectWithMetadata)
        : objectWithMetadata;
    return result;
};
exports.formatToStore = formatToStore;
