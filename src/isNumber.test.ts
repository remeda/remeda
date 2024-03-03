import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from "../test/types_data_provider";
import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.number as AllTypesDataProviderTypes;
    if (isNumber(data)) {
      expect(typeof data).toEqual("number");
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNumber);
    expect(data.every((c) => typeof c === "number")).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<number>>();
  });

  it("should work even if data type is unknown", () => {
    const data = TYPES_DATA_PROVIDER.number as unknown;
    if (isNumber(data)) {
      expect(typeof data).toEqual("number");
      assertType<number>(data);
    }
  });

  it("should work with literal types", () => {
    const data = (): 1 | 2 | 3 | string => {
      return 1;
    };
    const x = data();
    if (isNumber(x)) {
      expect(typeof x).toEqual("number");
      expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>(x);
    }
  });
});
