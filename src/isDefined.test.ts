import { typesDataProvider, type TestClass } from '../test/types_data_provider';
import { isDefined } from './isDefined';

describe('isDefined', () => {
  test('isDefined": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDefined(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >(data);
    }
  });
  test('isDefined: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
    ].filter(isDefined);
    expect(data).toHaveLength(4);
    assertType<
      Array<
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >
    >(data);
  });
});

describe('strict', () => {
  test('isDefined": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDefined.strict(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | null
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >(data);
    }
  });
  test('isDefined: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('undefined'),
    ].filter(isDefined.strict);
    expect(data).toHaveLength(5);
    assertType<
      Array<
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | null
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >
    >(data);
  });
});
