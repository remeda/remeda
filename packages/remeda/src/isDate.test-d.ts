import { expectTypeOf, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isDate } from "./isDate";

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
  if (isDate(data)) {
    expectTypeOf(data).toEqualTypeOf<Date>();
  }
});

test("should narrow `unknown`", () => {
  const data = TYPES_DATA_PROVIDER.date as unknown;
  if (isDate(data)) {
    expectTypeOf(data).toEqualTypeOf<Date>();
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);

  expectTypeOf(data).toEqualTypeOf<Array<Date>>();
});
