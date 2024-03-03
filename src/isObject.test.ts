import type { AllTypesDataProviderTypes } from "../test/types_data_provider";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type TestClass,
} from "../test/types_data_provider";
import { isObject } from "./isObject";

describe("isObject", () => {
  test("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
    if (isObject(data)) {
      expect(typeof data).toEqual("object");
      expectTypeOf(data).toEqualTypeOf<
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | { readonly a: "asd" }
      >();
    }
  });

  test("should work as type guard", () => {
    const data = { data: 5 } as ReadonlyArray<number> | { data: 5 };
    if (isObject(data)) {
      expect(typeof data).toEqual("object");
      expectTypeOf(data).toEqualTypeOf<{ data: 5 }>();
    }
  });

  test("should work as type guard for more narrow types", () => {
    const data = { data: 5 } as Array<number> | { data: number };
    if (isObject(data)) {
      expect(typeof data).toEqual("object");
      expectTypeOf(data).toEqualTypeOf<{ data: number }>();
    }
  });

  test("should work even if data type is unknown", () => {
    const data = TYPES_DATA_PROVIDER.object as unknown;
    if (isObject(data)) {
      expect(typeof data).toEqual("object");
      expectTypeOf(data).toEqualTypeOf<Record<string, unknown>>();
    }
  });

  test("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObject);
    expect(
      data.every((c) => typeof c === "object" && !Array.isArray(c)),
    ).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | { readonly a: "asd" }
      >
    >(data);
  });
});
