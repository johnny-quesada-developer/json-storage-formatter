# json-storage-formatter

Package for json stringify objects without losing data types. The transformation of the data includes extra metadata into the resulted string which later on is used to restored all the data structures to the their origninal forms.

The library suppors Sets, Maps, Objects, Arrays, and Primitive data like Dates

# API

The main methods of the library are **formatToStore** and **formatFromStore**

## formatToStore

Format an object to be stored as JSON

```TS
const objectWithMetadata = formatToStore(object);

// The result can be JSON.stringify
console.log(objectWithMetadata);
/*
{
    $t: 'map',
    $v: [
        [
        'key1',
        {
            $t: 'date',
            $v: '2021-05-08T13:30:00.000Z',
        },
        ],
        [
        'key2',
        {
            $t: 'set',
            $v: [
            {
                $t: 'map',
                $v: [
                [
                    'key1',
                    {
                    $t: 'date',
                    $v: '2021-05-08T13:30:00.000Z',
                    },
                ],
                ],
            },
            ],
        },
        ],
    ],
}
*/

// you can also stringify directly the result by specifying it on the configuration parameter
const objectString = formatToStore(object, { stringify: true });

console.log(objectString); // {"$t":"map","$v":[["key1",{"$t":"date","$v":"2021-05-08T13:30:00.000Z"}],["key2",{"$t":"set","$v":[{"$t":"map","$v":[["key1",{"$t":"date","$v":"2021-05-08T13:30:00.000Z"}]]}]}]]}

```

## formatFromStore<T>

Format a value with possible metadata to his original form, it also supports Map, Set, Arrays

```TS
const object = formatFromStore<Map<string, unknown>>(objectWithMetadata);

// Original types of the object with metadata
console.log(object);

/*
// the result will be the same than executing the following code
const formatFromStoreResultExample = new Map([
    ['key1', new Date('2021-05-08T13:30:00.000Z')],
    [
        'key2',
        new Set([new Map([['key1', new Date('2021-05-08T13:30:00.000Z')]])]),
    ],
]);
    */
```

## clone

Deep clone an object, it also suppors Map, Set, Arrays.
The formatters clones the objects to avoid modify the parameter reference

```ts
const clone: <T>(obj: T) => T;
```

## isNil

Check if a value is null or undefined

```ts
const isNil: (value: unknown) => boolean;
```

## isNumber

Check if a value is a number

```ts
const isNumber: (value: unknown) => boolean;
```

## isBoolean

Check if a value is a boolean

```ts
const isBoolean: (value: unknown) => boolean;
```

## isString

Check if a value is a string

```ts
const isString: (value: unknown) => boolean;
```

## isDate

Check if a value is a Date

```ts
const isDate: (value: unknown) => boolean;
```
