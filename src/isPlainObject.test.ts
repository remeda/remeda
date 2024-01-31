import {
  ALL_TYPES_DATA_PROVIDER,
  TestClass,
  typesDataProvider,
} from '../test/types_data_provider';
import { isPlainObject } from './isPlainObject';

describe('runtime', () => {
  it('accepts simple objects', () => {
    expect(isPlainObject({ a: 123 })).toEqual(true);
  });

  it('accepts trivial empty objects', () => {
    expect(isPlainObject({})).toEqual(true);
  });

  it('rejects strings', () => {
    expect(isPlainObject('asd')).toEqual(false);
  });

  it('rejects arrays', () => {
    expect(isPlainObject([1, 2, 3])).toEqual(false);
  });

  it('rejects classes', () => {
    expect(isPlainObject(new TestClass())).toEqual(false);
  });

  it('accepts null prototypes', () => {
    expect(isPlainObject(Object.create(null))).toEqual(true);
  });

  test('ALL_TYPES_DATA_PROVIDER', () => {
    expect(ALL_TYPES_DATA_PROVIDER.filter(isPlainObject))
      .toMatchInlineSnapshot(`
        [
          {
            "a": "asd",
          },
        ]
      `);
  });
});

describe('typing', () => {
  test('narrows readonly records', () => {
    const data: { readonly a: 123 } = { a: 123 };
    if (isPlainObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123 }>();
    }
  });

  test('narrows mixed records', () => {
    const data: { readonly a: 123; b: boolean } = { a: 123, b: false };
    if (isPlainObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123; b: boolean }>();
    }
  });

  test('should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isPlainObject(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });

  test('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('object');
    if (isPlainObject(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
  });

  test('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isPlainObject);
    expectTypeOf(data).toEqualTypeOf<Array<{ a: string }>>();
  });
});
