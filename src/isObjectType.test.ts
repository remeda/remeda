import {
  ALL_TYPES_DATA_PROVIDER,
  TestClass,
  typesDataProvider,
} from '../test/types_data_provider';
import { isObjectType } from './isObjectType';

describe('runtime', () => {
  it('accepts simple objects', () => {
    expect(isObjectType({ a: 123 })).toEqual(true);
  });

  it('accepts trivial empty objects', () => {
    expect(isObjectType({})).toEqual(true);
  });

  it('rejects strings', () => {
    expect(isObjectType('asd')).toEqual(false);
  });

  it('rejects null', () => {
    expect(isObjectType(null)).toEqual(false);
  });

  it('accepts arrays', () => {
    expect(isObjectType([1, 2, 3])).toEqual(true);
  });

  it('accepts classes', () => {
    expect(isObjectType(new TestClass())).toEqual(true);
  });

  it('accepts null prototypes', () => {
    expect(isObjectType(Object.create(null))).toEqual(true);
  });

  test('ALL_TYPES_DATA_PROVIDER', () => {
    expect(ALL_TYPES_DATA_PROVIDER.filter(isObjectType)).toMatchInlineSnapshot(`
      [
        [
          1,
          2,
          3,
        ],
        1985-07-24T07:40:00.000Z,
        [Error: asd],
        TestClass {},
        Map {},
        {
          "a": "asd",
        },
        Promise {},
        /test/gu,
        Set {},
        [
          1,
          2,
          3,
        ],
        Uint8Array [
          0,
        ],
      ]
    `);
  });
});

describe('typing', () => {
  test('narrows nullable types', () => {
    const data: { a: string } | null = { a: 'hello' };
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });

  test('isObjectType: should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
      >();
    }
  });

  test('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('object');
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<object>();
    }
  });

  test('isObjectType: should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObjectType);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | RegExp
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | Date
        | Error
        | Promise<number>
        | TestClass
        | Set<string>
        | Map<string, string>
        | Uint8Array
      >
    >();
  });
});
