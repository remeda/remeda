import { typesDataProvider, type TestClass } from '../test/types_data_provider';
import { isNonNull } from './isNonNull';

describe('isNonNull', () => {
  test('isNonNull": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isNonNull(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | boolean
        | string
        | { a: string }
        | (() => void)
        | Array<number>
        | Date
        | Error
        | number
        | Promise<number>
        | undefined
        | [number, number, number]
        | Map<string, string>
        | RegExp
        | Set<string>
        | symbol
        | TestClass
        | Uint8Array
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
        | string
        | number
        | boolean
        | {
            a: string;
          }
        | (() => void)
        | Array<number>
        | Date
        | Error
        | Promise<number>
        | undefined
        | [number, number, number]
        | Map<string, string>
        | RegExp
        | Set<string>
        | symbol
        | TestClass
        | Uint8Array
      >
    >(data);
  });
});
