import { describe, expectTypeOf, test } from "vitest";
import { findLastIndex } from "./findLastIndex";
import { pipe } from "./pipe";

describe("union of arrays", () => {
  test("data-first", () => {
    findLastIndex([] as number[] | string[], (value) => {
      expectTypeOf(value).toEqualTypeOf<number | string>();

      return true;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      findLastIndex((value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();

        return true;
      }),
    );
  });
});
