import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { sortedIndexWith } from "./sortedIndexWith";

describe("union of arrays", () => {
  test("data-first", () => {
    sortedIndexWith([] as number[] | string[], (value) => {
      expectTypeOf(value).toEqualTypeOf<number | string>();

      return true;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      sortedIndexWith((value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();

        return true;
      }),
    );
  });
});
