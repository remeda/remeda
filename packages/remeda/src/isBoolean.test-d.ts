import { expectTypeOf, it } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isBoolean } from "./isBoolean";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.boolean as AllTypesDataProviderTypes;
  if (isBoolean(data)) {
    expectTypeOf(data).toEqualTypeOf<boolean>();
  }
});

it("should narrow `unknown`", () => {
  const data = TYPES_DATA_PROVIDER.boolean as unknown;
  if (isBoolean(data)) {
    expectTypeOf(data).toEqualTypeOf<boolean>();
  }
});

it("should narrow `any`", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment -- Explicitly testing `any`
  const data = TYPES_DATA_PROVIDER.boolean as any;
  if (isBoolean(data)) {
    expectTypeOf(data).toEqualTypeOf<boolean>();
  }
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isBoolean);

  expectTypeOf(data).toEqualTypeOf<Array<boolean>>();
});
