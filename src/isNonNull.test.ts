import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
  TestClass,
} from "../test/types_data_provider";
import { isNonNull } from "./isNonNull";

describe("isNonNull", () => {
  test("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isNonNull(data)) {
      expect(data instanceof Date).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { readonly a: "asd" }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >();
    }
  });
  test("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);
    expect(data).toHaveLength(17);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | (() => void)
        | [number, number, number]
        | { readonly a: "asd" }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >
    >(data);
  });
});
