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
        [
          1,
          2,
          3,
        ],
        1985-07-24T07:40:00.000Z,
        [Error: asd],
        TestClass {},
        {
          "a": "asd",
        },
        Promise {},
        /test/gu,
        Map {},
        Set {},
        Uint8Array [
          0,
        ],
      ]
    `);
  });
});

describe('typing', () => {
  test('isObjectType: should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<
        | RegExp
        | (() => void)
        | { a: string }
        | Array<number>
        | Date
        | Error
        | Promise<number>
        | TestClass
        | Set<string>
        | Map<string, string>
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
