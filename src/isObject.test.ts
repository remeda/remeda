import {
  ALL_TYPES_DATA_PROVIDER,
  typesDataProvider,
  type TestClass,
} from '../test/types_data_provider';
import { isObject } from './isObject';

describe('isObject', () => {
  test('isObject: should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<
        | { a: string }
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
      >(data);
    }
  });

  test('isObject: should work as type guard', () => {
    const data = { data: 5 } as ReadonlyArray<number> | { data: 5 };
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<{
        data: 5;
      }>(data);
    }
  });

  test('isObject: should work as type guard for more narrow types', () => {
    const data = { data: 5 } as Array<number> | { data: number };
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<{
        data: number;
      }>(data);
    }
  });

  test('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<Record<string, unknown>>(data);
    }
  });

  test('isObject: should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObject);
    expect(data.every(c => typeof c === 'object' && !Array.isArray(c))).toEqual(
      true
    );
    assertType<
      Array<
        | { a: string }
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
      >
    >(data);
  });
});
