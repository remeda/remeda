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

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  sortedIndexWith([{ a: 1 }, { a: 2, b: "x" }], (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return true;
  });
});
