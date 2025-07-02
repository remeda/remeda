import { expectTypeOf, it } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isFunction } from "./isFunction";

it("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.function as AllTypesDataProviderTypes;
  if (isFunction(data)) {
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

  expectTypeOf(data).toEqualTypeOf<Array<() => void>>();
});
