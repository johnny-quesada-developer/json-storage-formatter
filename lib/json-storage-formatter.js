"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToStore = exports.formatFromStore = exports.isPrimitive = exports.isDate = exports.isString = exports.isBoolean = exports.isNumber = exports.isNil = exports.clone = void 0;
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
        const isMetaDate = (obj === null || obj === void 0 ? void 0 : obj._type_) === 'date';
        if (isMetaDate) {
            return new Date(obj.value);
        }
        const isMetaMap = (obj === null || obj === void 0 ? void 0 : obj._type_) === 'map';
        if (isMetaMap) {
            const mapData = ((_a = obj.value) !== null && _a !== void 0 ? _a : []).map(([key, item]) => [key, (0, exports.formatFromStore)(item)]);
            return new Map(mapData);
        }
        const isMetaSet = (obj === null || obj === void 0 ? void 0 : obj._type_) === 'set';
        if (isMetaSet) {
            const setData = (_b = obj.value) !== null && _b !== void 0 ? _b : [].map((item) => (0, exports.formatFromStore)(item));
            return new Set(setData);
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
 * Add metadata to a value to store it as json, it also supports Map, Set, Arrays
 * @returns
 * A value with metadata to store it as json
 */
const formatToStore = (value) => {
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
            return {
                _type_: 'map',
                value: pairs.map((pair) => (0, exports.formatToStore)(pair)),
            };
        }
        const isSet = obj instanceof Set;
        if (isSet) {
            const values = Array.from(obj.values());
            return {
                _type_: 'set',
                value: values.map((item) => (0, exports.formatToStore)(item)),
            };
        }
        if ((0, exports.isDate)(obj)) {
            return {
                _type_: 'date',
                value: obj.toISOString(),
            };
        }
        const keys = Object.keys(obj);
        return keys.reduce((acumulator, key) => {
            const prop = obj[key];
            return Object.assign(Object.assign({}, acumulator), { [key]: (0, exports.formatToStore)(prop) });
        }, {});
    };
    return format((0, exports.clone)(value));
};
exports.formatToStore = formatToStore;
