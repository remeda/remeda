import { describe, expectTypeOf, test } from "vitest";
import { meanBy } from "./meanBy";
import { pipe } from "./pipe";

describe("union of arrays", () => {
  test("data-first", () => {
    meanBy([] as number[] | string[], (value) => {
      expectTypeOf(value).toEqualTypeOf<number | string>();

      return 0;
    });
  });

  test("data-last", () => {
    pipe(
      [] as number[] | string[],
      meanBy((value) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();

        return 0;
      }),
    );
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  meanBy([{ a: 1 }, { a: 2, b: "x" }], (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return item.a;
  });
});
