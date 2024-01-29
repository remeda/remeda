import { typesDataProvider, type TestClass } from '../test/types_data_provider';
import { isNonNull } from './isNonNull';

describe('isNonNull', () => {
  test('isNonNull": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isNonNull(data)) {
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
        | undefined
      >(data);
    }
  });
  test('isNonNull: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('undefined'),
    ].filter(isNonNull);
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
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >
    >(data);
  });
});
