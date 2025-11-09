// import {
//   isBoolean,
//   isDate,
//   isNil,
//   isNumber,
//   isPrimitive,
//   isString,
//   formatFromStore,
//   formatToStore,
//   EnvelopData,
// } from '../';

import {
  isBoolean,
  isDate,
  isNil,
  isNumber,
  isPrimitive,
  isString,
  formatFromStore,
  formatToStore,
  EnvelopData,
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
  it('should correctly restore the value to its original form', () => {
    // simple values
    expect(formatFromStore('{}')).toEqual({});
    expect(formatFromStore('[]')).toEqual([]);
    expect(formatFromStore('1')).toEqual(1);
    expect(formatFromStore('0')).toEqual(0);
    expect(formatFromStore('null')).toEqual(null);
    expect(formatFromStore(JSON.stringify({ $t: 'undefined' }))).toEqual(undefined);
    expect(formatFromStore('true')).toEqual(true);
    expect(formatFromStore('false')).toEqual(false);

    // dates
    const date = new Date('2020-01-01T00:00:00.000Z');

    const value: EnvelopData = {
      $t: 'date',
      $v: date.toISOString(),
    };

    const valueStr = JSON.stringify(value);

    expect(formatFromStore(valueStr)).toEqual(date);
  });

  it('should return the proper parsed value', () => {
    expect(formatFromStore('{}')).toEqual({});
    expect(formatFromStore('[]')).toEqual([]);
    expect(formatFromStore('1')).toEqual(1);
    expect(formatFromStore('0')).toEqual(0);
    expect(formatFromStore('null')).toEqual(null);
    expect(formatFromStore(JSON.stringify({ $t: 'undefined' }))).toEqual(undefined);
    expect(formatFromStore('true')).toEqual(true);
    expect(formatFromStore('false')).toEqual(false);
  });

  const value: EnvelopData = {
    $v: '2020-01-01T00:00:00.000Z',
    $t: 'date',
  };

  it('should return the parsed value if it is a valid JSON string', () => {
    expect(formatFromStore(JSON.stringify(value))).toEqual(new Date('2020-01-01T00:00:00.000Z'));
  });
});

describe('formatToStore', () => {
  it('should return the original value if it is not a primitive', () => {
    const obj = {};
    expect(formatToStore(obj)).toEqual(JSON.stringify(obj));

    const arr: unknown[] = [];
    expect(formatToStore(arr)).toEqual(JSON.stringify(arr));

    const value: EnvelopData = {
      $t: 'date',
      $v: '2022-12-13T23:35:30.675Z',
    };

    expect(formatToStore(new Date('2022-12-13T23:35:30.675Z'))).toEqual(JSON.stringify(value));
  });

  it('should return the stringified value if it is a primitive', () => {
    expect(formatToStore(1)).toEqual(JSON.stringify(1));
    expect(formatToStore(0)).toEqual(JSON.stringify(0));
    expect(formatToStore('')).toEqual(JSON.stringify(''));
    expect(formatToStore('true')).toEqual(JSON.stringify('true'));
    expect(formatToStore('false')).toEqual(JSON.stringify('false'));
    expect(formatToStore(null)).toEqual(JSON.stringify(null));
    expect(formatToStore(undefined)).toEqual(JSON.stringify({ $t: 'undefined' }));
    expect(formatToStore(true)).toEqual(JSON.stringify(true));
    expect(formatToStore(false)).toEqual(JSON.stringify(false));
  });

  it('should return the stringified the stringify parameter is true', () => {
    expect(formatToStore(1)).toEqual('1');
    expect(formatToStore(0)).toEqual('0');
    expect(formatToStore('')).toEqual('""');
    expect(formatToStore('true')).toEqual('"true"');
    expect(formatToStore('false')).toEqual('"false"');
    expect(formatToStore(null)).toEqual('null');
    expect(formatToStore(true)).toEqual('true');
    expect(formatToStore(false)).toEqual('false');
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

    expect(JSON.parse(formatted)).toEqual({
      c: true,
      e: null,
      f: {
        $t: 'undefined',
      },
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

    expect(JSON.parse(formatted)).toEqual({
      b: '2',
      c: true,
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

    expect(JSON.parse(formatted)).toEqual({
      a: 1,
      c: true,
      f: {
        $t: 'undefined',
      },
    });
  });

  it('should properly handle complex nested objects', () => {
    const primitives = {
      bool: true,
      date: new Date('2020-01-01T00:00:00.000Z'),
      null: null,
      num: 1,
      zero: 0,
      negative: -1,
      str: 'string',
      undef: undefined,
      regex: new RegExp('^test$', 'i'),
      error: new Error('Test error'),
      emptyString: '',
      undefString: 'undefined',
      nullString: 'null',
      emptyArr: [],
      emptySet: new Set(),
      emptyMap: new Map(),
      emptyObj: {},
    };

    const array = Object.values(primitives);
    const set = new Set(Object.values(primitives));
    const map = new Map(Object.entries(primitives));
    const numericMap = new Map(Object.entries(primitives).map(([, value], index) => [index, value]));
    const objectMap = new Map(
      Object.entries(primitives).map(([key, value]) => [
        {
          key,
        },
        {
          value,
        },
      ]),
    );

    const collections = {
      array,
      set,
      map,
      numericMap,
      objectMap,
    };

    const obj = {
      ...primitives,
      ...collections,
      nested: {
        ...primitives,
        ...collections,
        nestedOnArray: [{ ...primitives }, [...array], new Set(set), new Map(map)],
        nestedOnSet: new Set([{ ...primitives }, [...array], new Set(set), new Map(map)]),
        nestedOnMap: new Map<string, unknown>([
          ['primitives', { ...primitives }],
          ['array', [...array]],
          ['set', new Set(set)],
          ['map', new Map(map)],
        ]),
      },
    };

    const valueToStore = formatToStore(obj, {
      sortKeys: true,
    });

    const result = formatFromStore(valueToStore) as typeof obj;

    expect(obj).toEqual(result);
  });
});
