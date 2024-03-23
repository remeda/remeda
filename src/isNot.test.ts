import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  type TestClass,
} from "../test/typesDataProvider";
import { isNot } from "./isNot";
import { isPromise } from "./isPromise";
import { isString } from "./isString";

describe("isNot", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.promise as AllTypesDataProviderTypes;
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toBe(true);
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
        | symbol
        | 1n
        | (() => void)
        | { readonly a: "asd" }
        | [number, number, number]
        | null
        | undefined
      >(data);
    }
  });

  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNot(isPromise));
    expect(data.some((c) => c instanceof Promise)).toBe(false);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | Array<number>
        | Date
        | Error
        | Map<string, string>
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
        | null
        | undefined
      >
    >();
  });
});
