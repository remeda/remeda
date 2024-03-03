import type { AllTypesDataProviderTypes } from "../test/types_data_provider";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/types_data_provider";
import { isFunction } from "./isFunction";

describe("isFunction", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.function as AllTypesDataProviderTypes;
    if (isFunction(data)) {
      expect(typeof data).toEqual("function");
      expectTypeOf(data).toEqualTypeOf<() => void>();
    }

    let maybeFunction: string | ((a: number) => string) | undefined;
    if (isFunction(maybeFunction)) {
      maybeFunction(1);
      expectTypeOf(maybeFunction).toEqualTypeOf<(a: number) => string>();
    }
  });

  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isFunction);
    expect(data.every((c) => typeof c === "function")).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<() => void>>();
  });
});
