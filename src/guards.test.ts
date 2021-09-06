import { AssertEqual } from './_types';
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

describe('isString', () => {
  test('isString: should work as type guard', () => {
    const data = dataProvider('string');
    if (isString(data)) {
      expect(typeof data).toEqual('string');
      const result: AssertEqual<typeof data, string> = true;
      expect(result).toEqual(true);
    }
  });
  test('isString: should work even if data type is unknown', () => {
    const data: unknown = dataProvider('string');
    if (isString(data)) {
      expect(typeof data).toEqual('string');
      const result: AssertEqual<typeof data, string> = true;
      expect(result).toEqual(true);
    }
  });

  test('isString: should work with literal types', () => {
    const data = (): 'a' | 'b' | 'c' | number => {
      return 'a';
    };
    const x = data();
    if (isString(x)) {
      expect(typeof x).toEqual('string');
      const result: AssertEqual<typeof x, 'a' | 'b' | 'c'> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, string[]> = true;
    expect(result).toEqual(true);
  });
});

describe('isBoolean', () => {
  test('isBoolean: should work as type guard', () => {
    const data = dataProvider('boolean');
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      const result: AssertEqual<typeof data, boolean> = true;
      expect(result).toEqual(true);
    }

    const data1: unknown = dataProvider('boolean');
    if (isBoolean(data1)) {
      expect(typeof data1).toEqual('boolean');
      const result: AssertEqual<typeof data1, boolean> = true;
      expect(result).toEqual(true);
    }

    const data2: any = dataProvider('boolean');
    if (isBoolean(data2)) {
      expect(typeof data2).toEqual('boolean');
      const result: AssertEqual<typeof data2, boolean> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, boolean[]> = true;
    expect(result).toEqual(true);
  });
});

describe('isArray', () => {
  test('isArray: should work as type guard', () => {
    const data = dataProvider('array');
    if (isArray(data)) {
      expect(Array.isArray(data)).toEqual(true);
      const result: AssertEqual<typeof data, number[]> = true;
      expect(result).toEqual(true);
    }

    const data1: unknown = dataProvider('array');
    if (isArray(data1)) {
      const result: AssertEqual<typeof data1, readonly unknown[]> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, number[][]> = true;
    expect(result).toEqual(true);
  });
});

describe('isDate', () => {
  test('isDate: should work as type guard', () => {
    const data = dataProvider('date');
    if (isDate(data)) {
      expect(data instanceof Date).toEqual(true);
      const result: AssertEqual<typeof data, Date> = true;
      expect(result).toEqual(true);
    }

    const data1: unknown = dataProvider('date');
    if (isDate(data1)) {
      const result: AssertEqual<typeof data1, Date> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, Date[]> = true;
    expect(result).toEqual(true);
  });
});
describe('isDefined', () => {
  test('isDefined": should work as type guard', () => {
    const data = dataProvider('date');
    if (isDefined(data)) {
      expect(data instanceof Date).toEqual(true);
      const result: AssertEqual<
        typeof data,
        | boolean
        | string
        | { a: string }
        | (() => void)
        | number[]
        | Date
        | Error
        | number
        | Promise<number>
      > = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<
      typeof data,
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
    > = true;
    expect(result).toEqual(true);
  });
});

describe('isNil', () => {
  test('isNil: should work as type guard', () => {
    const data = dataProvider('null');
    if (isNil(data)) {
      expect(data).toEqual(null);
      const result: AssertEqual<typeof data, undefined | null> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, (undefined | null)[]> = true;
    expect(result).toEqual(true);
  });
});

describe('isFunction', () => {
  test('isFunction: should work as type guard', () => {
    const data = dataProvider('null');
    if (isFunction(data)) {
      expect(data).toEqual(null);
      const result: AssertEqual<typeof data, () => void> = true;
      expect(result).toEqual(true);
    }

    let maybeFunction: string | ((a: number) => string) | undefined;
    if (isFunction(maybeFunction)) {
      maybeFunction(1);
      const result1: AssertEqual<
        typeof maybeFunction,
        (a: number) => string
      > = true;
      expect(result1).toEqual(true);
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
    const result: AssertEqual<typeof data, (() => void)[]> = true;
    expect(result).toEqual(true);
  });
});
describe('isError', () => {
  test('isError: should work as type guard', () => {
    const data = dataProvider('error');
    if (isError(data)) {
      expect(data instanceof Error).toEqual(true);
      const result: AssertEqual<typeof data, Error> = true;
      expect(result).toEqual(true);
    }

    class MyError extends Error {}

    let maybeError: MyError | undefined;
    if (isError(maybeError)) {
      const result1: AssertEqual<typeof maybeError, MyError> = true;
      expect(result1).toEqual(true);
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
    const result: AssertEqual<typeof data, Error[]> = true;
    expect(result).toEqual(true);
  });
});
describe('isNumber', () => {
  test('isNumber: should work as type guard', () => {
    const data = dataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      const result: AssertEqual<typeof data, number> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, number[]> = true;
    expect(result).toEqual(true);
  });
  test('should work even if data type is unknown', () => {
    const data: unknown = dataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      const result: AssertEqual<typeof data, number> = true;
      expect(result).toEqual(true);
    }
  });
  test('should work with literal types', () => {
    const data = (): 1 | 2 | 3 | string => {
      return 1;
    };
    const x = data();
    if (isNumber(x)) {
      expect(typeof x).toEqual('number');
      const result: AssertEqual<typeof x, 1 | 2 | 3> = true;
      expect(result).toEqual(true);
    }
  });
});

describe('isObject', () => {
  test('isObject: should work as type guard', () => {
    const data = dataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      const result: AssertEqual<
        typeof data,
        | {
            a: string;
          }
        | Date
        | Error
        | Promise<number>
      > = true;
      expect(result).toEqual(true);
    }
  });

  test('isObject: should work as type guard', () => {
    const data = { data: 5 } as ReadonlyArray<number> | { data: 5 };
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      const result: AssertEqual<
        typeof data,
        {
          data: 5;
        }
      > = true;
      expect(result).toEqual(true);
    }
  });

  test('isObject: should work as type guard for more narrow types', () => {
    const data = { data: 5 } as Array<number> | { data: number };
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      const result: AssertEqual<
        typeof data,
        {
          data: number;
        }
      > = true;
      expect(result).toEqual(true);
    }
  });

  test('should work even if data type is unknown', () => {
    const data: unknown = dataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      const result: AssertEqual<typeof data, Record<string, unknown>> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<
      typeof data,
      (
        | {
            a: string;
          }
        | Date
        | Error
        | Promise<number>
      )[]
    > = true;
    expect(result).toEqual(true);
  });
});

describe('isPromise', () => {
  test('isPromise: should work as type guard', () => {
    const data = dataProvider('promise');
    if (isPromise(data)) {
      expect(data instanceof Promise).toEqual(true);
      const result: AssertEqual<typeof data, Promise<number>> = true;
      expect(result).toEqual(true);
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
    const result: AssertEqual<typeof data, Promise<number>[]> = true;
    expect(result).toEqual(true);
  });
});
describe('isTruthy', () => {
  test('isTruthy', () => {
    const data: false | '' | 0 | { a: string } = { a: 'asd' };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: 'asd' });
      const result: AssertEqual<typeof data, { a: string }> = true;
      expect(result).toEqual(true);
    }
  });
});
describe('isNot', () => {
  test('isNot: should work as type guard', () => {
    const data = dataProvider('promise');
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
      const result: AssertEqual<
        typeof data,
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
      > = true;
      expect(result).toEqual(true);
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

    const resultType: AssertEqual<
      typeof result,
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
    > = true;
    expect(resultType).toEqual(true);
  });
});
