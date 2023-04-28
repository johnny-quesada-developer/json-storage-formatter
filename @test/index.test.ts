import {
  isBoolean,
  isDate,
  isNil,
  isNumber,
  isPrimitive,
  isString,
  formatFromStore,
  formatToStore,
  IValueWithMetaData,
  clone,
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

describe('clone', () => {
  it('should return a clone of the object', () => {
    const obj = {
      a: 1,
      b: '2',
      c: true,
      d: new Date(),
      e: null,
      f: undefined,
      g: {
        h: 3,
        i: '4',
        j: false,
        k: new Date(),
        array: [1, 2, 3],
        map: new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      },
    };

    const cloned = clone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);

    expect(cloned.g.array).toEqual(obj.g.array);
    expect(cloned.g.array).not.toBe(obj.g.array);
    expect(cloned.g.map).toEqual(obj.g.map);
    expect(cloned.g.map).not.toBe(obj.g.map);
  });

  it('should return a shallow clone of the object', () => {
    const obj = {
      a: 1,
      b: '2',
      c: true,
      d: new Date(),
      e: null,
      f: undefined,
      g: {
        h: 3,
        i: '4',
        j: false,
        k: new Date(),
        array: [1, 2, 3],
        map: new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      },
    };

    const cloned = clone(obj, { shallow: true });

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);

    expect(cloned.g.array).toEqual(obj.g.array);
    expect(cloned.g.array).toBe(obj.g.array);
    expect(cloned.g.map).toEqual(obj.g.map);
    expect(cloned.g.map).toBe(obj.g.map);
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

    const value: IValueWithMetaData = {
      $t: 'date',
      $v: '2020-01-01T00:00:00.000Z',
    };

    expect(formatFromStore(value)).toEqual(
      new Date('2020-01-01T00:00:00.000Z')
    );
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

  const value: IValueWithMetaData = {
    $v: '2020-01-01T00:00:00.000Z',
    $t: 'date',
  };

  it('should return the parsed value if it is a valid JSON string', () => {
    expect(formatFromStore(value)).toEqual(
      new Date('2020-01-01T00:00:00.000Z')
    );
  });
});

describe('formatToStore', () => {
  it('should return the original value if it is not a primitive', () => {
    const obj = {};
    expect(formatToStore(obj)).toEqual(obj);

    const arr: unknown[] = [];
    expect(formatToStore(arr)).toEqual(arr);

    const value: IValueWithMetaData = {
      $t: 'date',
      $v: '2022-12-13T23:35:30.675Z',
    };

    expect(formatToStore(new Date('2022-12-13T23:35:30.675Z'))).toEqual(value);
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

  it('should return the stringified the stringify parameter is true', () => {
    expect(formatToStore(1, { stringify: true })).toEqual('1');
    expect(formatToStore(0, { stringify: true })).toEqual('0');
    expect(formatToStore('', { stringify: true })).toEqual('""');
    expect(formatToStore('true', { stringify: true })).toEqual('"true"');
    expect(formatToStore('false', { stringify: true })).toEqual('"false"');
    expect(formatToStore(null, { stringify: true })).toEqual('null');
    expect(formatToStore(true, { stringify: true })).toEqual('true');
    expect(formatToStore(false, { stringify: true })).toEqual('false');
  });

  it('should avoid adding the object keys if the excludeKeys parameter is provided', () => {
    const obj = {
      a: 1,
      b: '2',
      c: true,
      e: null,
      f: undefined,
    };

    const formatted = formatToStore(obj, { excludeKeys: ['a', 'b'] });

    expect(formatted).toEqual({
      c: true,
      e: null,
      f: undefined,
    });
  });

  it('should avoid adding the object keys which match the excludesTypes parameter', () => {
    const obj = {
      a: 1,
      b: '2',
      c: true,
      f: undefined,
      g: () => {},
      t: {},
    };

    const formatted = formatToStore(obj, {
      excludeTypes: ['number', 'object'],
    });

    expect(formatted).toEqual({
      b: '2',
      c: true,
      f: undefined,
    });
  });

  it('should correctly use custom props validator', () => {
    const obj = {
      a: 1,
      b: '2',
      c: true,
      f: undefined,
    };

    const formatted = formatToStore(obj, {
      validator: ({ key }) => key !== 'b',
    });

    expect(formatted).toEqual({
      a: 1,
      c: true,
      f: undefined,
    });
  });
});
