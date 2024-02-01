import { isArray } from './isArray';
import { typesDataProvider } from '../test/types_data_provider';

describe('isArray', () => {
  test('isArray: should infer ReadonlyArray<unknown> when given any', () => {
    const data1: any = [];
    if (isArray(data1)) {
      expectTypeOf(data1).not.toBeAny();
      expectTypeOf(data1[0]).toBeUnknown();
    }
  });
  test('isArray: should work as type guard', () => {
    const data = typesDataProvider('array');
    if (isArray(data)) {
      expect(Array.isArray(data)).toEqual(true);
      assertType<Array<number>>(data);
    }

    const data1: unknown = typesDataProvider('array');
    if (isArray(data1)) {
      assertType<ReadonlyArray<unknown>>(data1);
    }
  });
  test('isArray: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('array'),
      typesDataProvider('date'),
    ].filter(isArray);
    expect(data.every(c => Array.isArray(c))).toEqual(true);
    assertType<Array<Array<number>>>(data);
  });
});

describe('typing', () => {
  test('mutable arrays work', () => {
    const data = [] as Array<number> | string;

    if (isArray(data)) {
      expectTypeOf(data).toEqualTypeOf<Array<number>>();
    }

    // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
    expectTypeOf([data].filter(isArray)).toEqualTypeOf<Array<Array<number>>>();
  });

  test('readonly arrays work', () => {
    const data = [] as ReadonlyArray<number> | string;

    if (isArray(data)) {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();
    }

    // We check the type when it's inferred from within an array due to https://github.com/remeda/remeda/issues/459 surfacing the issue. I don't know why it works differently than when checking data directly.
    expectTypeOf([data].filter(isArray)).toEqualTypeOf<
      Array<ReadonlyArray<number>>
    >();
  });
});
