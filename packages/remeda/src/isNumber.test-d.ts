import { expectTypeOf, it } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isNumber } from "./isNumber";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.number as AllTypesDataProviderTypes;
  if (isNumber(data)) {
    expectTypeOf(data).toEqualTypeOf<number>();
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNumber);

  expectTypeOf(data).toEqualTypeOf<Array<number>>();
});

it("should work even if data type is unknown", () => {
  const data = TYPES_DATA_PROVIDER.number as unknown;
  if (isNumber(data)) {
    expectTypeOf(data).toEqualTypeOf<number>();
  }
});

it("should work with literal types", () => {
  const x = dataFunction();
  if (isNumber(x)) {
    expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>(x);
  }
});

const dataFunction = (): string | 1 | 2 | 3 => 1;
