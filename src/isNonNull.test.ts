import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
} from "../test/typesDataProvider";
import { isNonNull } from "./isNonNull";

describe("isNonNull", () => {
  test("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isNonNull(data)) {
      expect(data instanceof Date).toBe(true);
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
        | boolean
        | number
        | string
        | symbol
        | 1n
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
        | undefined
      >();
    }
  });
  test("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);
    expect(data).toHaveLength(18);
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
        | boolean
        | number
        | string
        | symbol
        | 1n
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
        | undefined
      >
    >(data);
  });
});
