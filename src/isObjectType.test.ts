import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  TestClass,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isObjectType } from "./isObjectType";

describe("runtime", () => {
  it("accepts simple objects", () => {
    expect(isObjectType({ a: 123 })).toEqual(true);
  });

  it("accepts trivial empty objects", () => {
    expect(isObjectType({})).toEqual(true);
  });

  it("rejects strings", () => {
    expect(isObjectType("asd")).toEqual(false);
  });

  it("rejects null", () => {
    expect(isObjectType(null)).toEqual(false);
  });

  it("accepts arrays", () => {
    expect(isObjectType([1, 2, 3])).toEqual(true);
  });

  it("accepts classes", () => {
    expect(isObjectType(new TestClass())).toEqual(true);
  });

  it("accepts null prototypes", () => {
    expect(isObjectType(Object.create(null))).toEqual(true);
  });

  test("ALL_TYPES_DATA_PROVIDER", () => {
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

describe("typing", () => {
  test("narrows nullable types", () => {
    const data: { a: string } | null = { a: "hello" };
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });

  test("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
      >();
    }
  });

  test("should work even if data type is unknown", () => {
    const data = TYPES_DATA_PROVIDER.object as unknown;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<object>();
    }
  });

  test("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObjectType);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
      >
    >();
  });

  test("Can narrow down `any`", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly testing `any`
    const data = { hello: "world" } as any;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<object>();
    }
  });
});
