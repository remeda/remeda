import {
  isString,
  isBoolean,
  isArray,
  isDate,
  isDefined,
  isNil,
  isFunction,
  isError,
  isNumber,
  isObject,
  isPromise,
  isTruthy,
  isNot,
} from './guards';

type TestObj =
  | boolean
  | string
  | { a: string }
  | (() => void)
  | number[]
  | Date
  | undefined
  | null
  | Error
  | number
  | Promise<number>;

function assertType<T>(data: T): T {
  return data;
}

const dataProvider = (
  t:
    | 'string'
    | 'boolean'
    | 'object'
    | 'function'
    | 'array'
    | 'date'
    | 'undefined'
    | 'null'
    | 'error'
    | 'number'
    | 'promise'
): TestObj => {
  switch (t) {
    case 'number':
      return 5;
    case 'array':
      return [1, 2, 3];
    case 'boolean':
      return false;
    case 'date':
      return new Date();
    case 'function':
      return () => {};
    case 'null':
      return null;
    case 'promise':
      return Promise.resolve(5);
    case 'string':
      return 'text';
    case 'object':
      return { a: 'asd' };
    case 'error':
      return new Error('asd');
  }
  return 'text';
};

describe('Describe guards behavior', () => {
  test('isString: should work as type guard', () => {
    const data = dataProvider('string');
    if (isString(data)) {
      expect(typeof data).toEqual('string');
      assertType<string>(data);
    }
  });
  test('isString: should work as type guard in array', () => {
    const data = [
      dataProvider('error'),
      dataProvider('string'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('array'),
      dataProvider('boolean'),
    ].filter(isString);
    expect(data.every(c => typeof c === 'string')).toEqual(true);
    assertType<string[]>(data);
  });
  test('isBoolean: should work as type guard', () => {
    const data = dataProvider('boolean');
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      assertType<boolean>(data);
    }
  });
  test('isBoolean: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('array'),
      dataProvider('boolean'),
    ].filter(isBoolean);
    expect(data.every(c => typeof c === 'boolean')).toEqual(true);
    assertType<boolean[]>(data);
  });
  test('isArray: should work as type guard', () => {
    const data = dataProvider('array');
    if (isArray(data)) {
      expect(Array.isArray(data)).toEqual(true);
      assertType<number[]>(data);
    }
  });
  test('isArray: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('array'),
      dataProvider('date'),
    ].filter(isArray);
    expect(data.every(c => Array.isArray(c))).toEqual(true);
    assertType<number[][]>(data);
  });
  test('isDate: should work as type guard', () => {
    const data = dataProvider('date');
    if (isDate(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<Date>(data);
    }
  });
  test('isDate: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('number'),
      dataProvider('date'),
    ].filter(isDate);
    expect(data.every(c => c instanceof Date)).toEqual(true);
    assertType<Date[]>(data);
  });
  test('isDefined": should work as type guard', () => {
    const data = dataProvider('date');
    if (isDefined(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | boolean
        | string
        | { a: string }
        | (() => void)
        | number[]
        | Date
        | Error
        | number
        | Promise<number>
      >(data);
    }
  });
  test('isDefined: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('number'),
    ].filter(isDefined);
    expect(data.length === 4).toEqual(true);
    assertType<
      (
        | string
        | number
        | boolean
        | {
            a: string;
          }
        | (() => void)
        | number[]
        | Date
        | Error
        | Promise<number>
      )[]
    >(data);
  });
  test('isNil: should work as type guard', () => {
    const data = dataProvider('null');
    if (isNil(data)) {
      expect(data).toEqual(null);
      assertType<undefined | null>(data);
    }
  });
  test('isNil: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('function'),
      dataProvider('null'),
      dataProvider('number'),
    ].filter(isNil);
    expect(data.every(c => c == null)).toEqual(true);
    assertType<(null | undefined)[]>(data);
  });
  test('isFunction: should work as type guard', () => {
    const data = dataProvider('null');
    if (isFunction(data)) {
      expect(data).toEqual(null);
      assertType<() => void>(data);
    }
  });
  test('isFunction: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('function'),
      dataProvider('function'),
      dataProvider('object'),
      dataProvider('number'),
    ].filter(isFunction);
    expect(data.every(c => typeof c === 'function')).toEqual(true);
    assertType<(() => void)[]>(data);
  });
  test('isError: should work as type guard', () => {
    const data = dataProvider('error');
    if (isError(data)) {
      expect(data instanceof Error).toEqual(true);
      assertType<Error>(data);
    }
  });
  test('isError: should work as type guard in filter', () => {
    const data = [
      dataProvider('error'),
      dataProvider('array'),
      dataProvider('boolean'),
      dataProvider('function'),
      dataProvider('object'),
      dataProvider('number'),
    ].filter(isError);
    expect(data.every(c => c instanceof Error)).toEqual(true);
    assertType<Error[]>(data);
  });
  test('isNumber: should work as type guard', () => {
    const data = dataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      assertType<number>(data);
    }
  });
  test('isNumber: should work as type guard in filter', () => {
    const data = [
      dataProvider('promise'),
      dataProvider('array'),
      dataProvider('boolean'),
      dataProvider('function'),
      dataProvider('object'),
      dataProvider('number'),
    ].filter(isNumber);
    expect(data.every(c => typeof c === 'number')).toEqual(true);
    assertType<number[]>(data);
  });

  test('isObject: should work as type guard', () => {
    const data = dataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<{ a: string }>(data);
    }
  });
  test('isObject: should work as type guard in filter', () => {
    const data = [
      dataProvider('promise'),
      dataProvider('array'),
      dataProvider('boolean'),
      dataProvider('function'),
      dataProvider('object'),
    ].filter(isObject);
    expect(data.every(c => typeof c === 'object' && !Array.isArray(c))).toEqual(
      true
    );
    assertType<{ a: string }[]>(data);
  });

  test('isPromise: should work as type guard', () => {
    const data = dataProvider('promise');
    if (isPromise(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<Promise<number>>(data);
    }
  });
  test('isPromise: should work as type guard in filter', () => {
    const data = [
      dataProvider('promise'),
      dataProvider('array'),
      dataProvider('boolean'),
      dataProvider('function'),
    ].filter(isPromise);
    expect(data.every(c => c instanceof Promise)).toEqual(true);
    assertType<Promise<number>[]>(data);
  });

  test('isTruthy', () => {
    const data: false | '' | 0 | { a: string } = { a: 'asd' };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: 'asd' });
      assertType<{ a: string }>(data);
    }
  });
  test('isNot: should work as type guard', () => {
    const data = dataProvider('promise');
    if (isNot(isString)(data)) {
      assertType<
        | number
        | boolean
        | {
            a: string;
          }
        | (() => void)
        | number[]
        | Date
        | Error
        | Promise<number>
        | null
        | undefined
      >(data);
      expect(data instanceof Promise).toEqual(true);
    }
  });
  test('isNot: should work as type guard in filter', () => {
    const data = [
      dataProvider('promise'),
      dataProvider('array'),
      dataProvider('boolean'),
      dataProvider('function'),
    ];
    const result = data.filter(isNot(isPromise));
    expect(result.some(c => c instanceof Promise)).toEqual(false);
    assertType<
      (
        | boolean
        | string
        | { a: string }
        | (() => void)
        | number[]
        | Date
        | undefined
        | null
        | Error
        | number
      )[]
    >(result);
  });
});
