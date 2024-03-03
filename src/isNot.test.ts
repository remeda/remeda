import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
  TestClass,
} from "../test/types_data_provider";
import { isNot } from "./isNot";
import { isPromise } from "./isPromise";
import { isString } from "./isString";

describe("isNot", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { readonly a: "asd" }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | null
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >(data);
    }
  });

  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
    expect(data.some((c) => c instanceof Promise)).toEqual(false);
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
        | null
        | number
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >
    >();
  });
});
