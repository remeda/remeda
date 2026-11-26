import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { reduce } from "./reduce";

describe("union of arrays", () => {
  test("data-first", () => {
    reduce(
      [] as number[] | string[],
      (accumulator, item) => {
        expectTypeOf(item).toEqualTypeOf<number | string>();

        return accumulator;
      },
      0,
    );
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      reduce((accumulator, item) => {
        expectTypeOf(item).toEqualTypeOf<number | string>();

        return accumulator;
      }, 0),
    );
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  reduce(
    [{ a: 1 }, { a: 2, b: "x" }],
    (accumulator, item) => {
      expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

      return accumulator + item.a;
    },
    0,
  );
});
