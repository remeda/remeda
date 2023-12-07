import {
  ALL_TYPES_DATA_PROVIDER,
  TestClass,
  typesDataProvider,
} from '../test/types_data_provider';
import { isRecord } from './isRecord';

describe('runtime', () => {
  it('accepts simple objects', () => {
    expect(isRecord({ a: 123 })).toEqual(true);
  });

  it('accepts trivial empty objects', () => {
    expect(isRecord({})).toEqual(true);
  });

  it('rejects strings', () => {
    expect(isRecord('asd')).toEqual(false);
  });

  it('rejects arrays', () => {
    expect(isRecord([1, 2, 3])).toEqual(false);
  });

  it('rejects classes', () => {
    expect(isRecord(new TestClass())).toEqual(false);
  });

  it('accepts null prototypes', () => {
    expect(isRecord(Object.create(null))).toEqual(true);
  });

  test('ALL_TYPES_DATA_PROVIDER', () => {
    expect(ALL_TYPES_DATA_PROVIDER.filter(isRecord)).toMatchInlineSnapshot(`
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
    if (isRecord(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123 }>();
    }
  });

  test('narrows mixed records', () => {
    const data: { readonly a: 123; b: boolean } = { a: 123, b: false };
    if (isRecord(data)) {
      expectTypeOf(data).toEqualTypeOf<{ readonly a: 123; b: boolean }>();
    }
  });

  test('isPlainObject: should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isRecord(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });

  test('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('object');
    if (isRecord(data)) {
      expectTypeOf(data).toEqualTypeOf<Record<PropertyKey, unknown>>();
    }
  });

  test('isPlainObject: should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isRecord);
    expectTypeOf(data).toEqualTypeOf<Array<{ a: string }>>();
  });
});
