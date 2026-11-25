import { describe, expectTypeOf, test } from "vitest";
import { findIndex } from "./findIndex";
import { pipe } from "./pipe";

describe("union of arrays", () => {
  test("data-first", () => {
    findIndex([] as number[] | string[], (value) => {
      expectTypeOf(value).toEqualTypeOf<number | string>();

      return true;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      findIndex((value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();

        return true;
      }),
    );
  });
});
