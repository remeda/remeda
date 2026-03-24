import { expectTypeOf, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
} from "../test/typesDataProvider";
import { isError } from "./isError";

class MyError extends Error {
  public constructor() {
    super();
    this.name = "MyError";
  }
}

declare const MAYBE_ERROR: MyError | undefined;

test("should work as type guard", () => {
  const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
  if (isError(data)) {
    expectTypeOf(data).toEqualTypeOf<Error>();
  }

  if (isError(MAYBE_ERROR)) {
    expectTypeOf(MAYBE_ERROR).toEqualTypeOf<MyError>();
  }
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);

  expectTypeOf(data).toEqualTypeOf<Error[]>();
});
