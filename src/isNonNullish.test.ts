import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
} from "../test/typesDataProvider";
import { isNonNullish } from "./isNonNullish";

describe("isNonNullish", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isNonNullish(data)) {
      expect(data instanceof Date).toEqual(true);
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
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
      >();
    }
  });
  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);
    expect(data).toHaveLength(16);
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
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
      >
    >();
  });
});
