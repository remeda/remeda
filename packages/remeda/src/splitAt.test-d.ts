import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { splitAt } from "./splitAt";

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(splitAt([] as number[] | string[], 1)).toEqualTypeOf<
      [(number | string)[], (number | string)[]]
    >();
  });

  test("data-last", () => {
    expectTypeOf(pipe([] as number[] | string[], splitAt(1))).toEqualTypeOf<
      [(number | string)[], (number | string)[]]
    >();
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  expectTypeOf(splitAt([{ a: 1 }, { a: 2, b: "x" }], 1)[0][0]?.b).toEqualTypeOf<
    string | undefined
  >();
});
