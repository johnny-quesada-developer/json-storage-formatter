import {
  isBoolean,
  isDate,
  isNil,
  isNumber,
  isPrimitive,
  isString,
  formatFromStore,
  formatToStore,
} from '../src';

describe('isBoolean', () => {
  it('should return true if the value is a boolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it('should return false if the value is not a boolean', () => {
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean('false')).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
  });
});

describe('isDate', () => {
  it('should return true if the value is a Date', () => {
    expect(isDate(new Date())).toBe(true);
  });

  it('should return false if the value is not a Date', () => {
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(1)).toBe(false);
    expect(isDate(0)).toBe(false);
    expect(isDate('')).toBe(false);
    expect(isDate('true')).toBe(false);
    expect(isDate('false')).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate(true)).toBe(false);
    expect(isDate(false)).toBe(false);
  });
});

describe('isNil', () => {
  it('should return true if the value is null or undefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false if the value is not null or undefined', () => {
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
    expect(isNil(1)).toBe(false);
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil('true')).toBe(false);
    expect(isNil('false')).toBe(false);
    expect(isNil(true)).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil(new Date())).toBe(false);
  });
});

describe('isNumber', () => {
  it('should return true if the value is a number', () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber(0)).toBe(true);
  });

  it('should return false if the value is not a number', () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber('true')).toBe(false);
    expect(isNumber('false')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
    expect(isNumber(new Date())).toBe(false);
  });
});

describe('isPrimitive', () => {
  it('should return true if the value is a primitive', () => {
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive('')).toBe(true);
    expect(isPrimitive('true')).toBe(true);
    expect(isPrimitive('false')).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
  });

  it('should return false if the value is not a primitive', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(new Date())).toBe(false);
  });
});

describe('isString', () => {
  it('should return true if the value is a string', () => {
    expect(isString('')).toBe(true);
    expect(isString('true')).toBe(true);
    expect(isString('false')).toBe(true);
  });

  it('should return false if the value is not a string', () => {
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(0)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(new Date())).toBe(false);
  });
});

describe('formatFromStore', () => {
  it('should return the original value if it is not a string', () => {
    expect(formatFromStore({})).toEqual({});
    expect(formatFromStore([])).toEqual([]);
    expect(formatFromStore(1)).toEqual(1);
    expect(formatFromStore(0)).toEqual(0);
    expect(formatFromStore(null)).toEqual(null);
    expect(formatFromStore(undefined)).toEqual(undefined);
    expect(formatFromStore(true)).toEqual(true);
    expect(formatFromStore(false)).toEqual(false);

    expect(
      formatFromStore({
        _type_: 'date',
        value: '2020-01-01T00:00:00.000Z',
      })
    ).toEqual(new Date('2020-01-01T00:00:00.000Z'));
  });

  it('should return string when string is input', () => {
    expect(formatFromStore('{}')).toEqual('{}');
    expect(formatFromStore('[]')).toEqual('[]');
    expect(formatFromStore('1')).toEqual('1');
    expect(formatFromStore('0')).toEqual('0');
    expect(formatFromStore('null')).toEqual('null');
    expect(formatFromStore('undefined')).toEqual('undefined');
    expect(formatFromStore('true')).toEqual('true');
    expect(formatFromStore('false')).toEqual('false');
  });

  it('should return the parsed value if it is a valid JSON string', () => {
    expect(
      formatFromStore({ value: '2020-01-01T00:00:00.000Z', _type_: 'date' })
    ).toEqual(new Date('2020-01-01T00:00:00.000Z'));
  });
});

describe('formatToStore', () => {
  it('should return the original value if it is not a primitive', () => {
    const obj = {};
    expect(formatToStore(obj)).toEqual(obj);

    const arr: unknown[] = [];
    expect(formatToStore(arr)).toEqual(arr);

    expect(formatToStore(new Date('2022-12-13T23:35:30.675Z'))).toEqual({
      _type_: 'date',
      value: '2022-12-13T23:35:30.675Z',
    });
  });

  it('should return the stringified value if it is a primitive', () => {
    expect(formatToStore(1)).toEqual(1);
    expect(formatToStore(0)).toEqual(0);
    expect(formatToStore('')).toEqual('');
    expect(formatToStore('true')).toEqual('true');
    expect(formatToStore('false')).toEqual('false');
    expect(formatToStore(null)).toEqual(null);
    expect(formatToStore(undefined)).toEqual(undefined);
    expect(formatToStore(true)).toEqual(true);
    expect(formatToStore(false)).toEqual(false);
  });
});
