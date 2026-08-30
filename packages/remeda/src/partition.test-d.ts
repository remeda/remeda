import { expectTypeOf, test, describe } from "vitest";
import { constant } from "./constant";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { partition } from "./partition";
import { pipe } from "./pipe";

test("partition with type guard", () => {
  expectTypeOf(partition([1, "a", 2, "b"], isNumber)).toEqualTypeOf<
    [number[], string[]]
  >();
});

test("narrows both sides when the predicate is wider than the item", () => {
  expectTypeOf(
    partition(["a", null] as (string | null)[], isNullish),
  ).toEqualTypeOf<[null[], string[]]>();
});

test("narrows tuples down to the matching items", () => {
  expectTypeOf(
    partition([1, "a", true] as [1, "a", true], isString),
  ).toEqualTypeOf<["a"[], (true | 1)[]]>();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(partition([] as string[], isNullish)).toEqualTypeOf<
    [never[], string[]]
  >();
});

test("`any` data", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
  expectTypeOf(partition([] as any[], isString)).toEqualTypeOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    [string[], any[]]
  >();
});

test("non-guard predicate keeps both sides unnarrowed", () => {
  expectTypeOf(partition([1, "a"], constant(true))).toEqualTypeOf<
    [(number | string)[], (number | string)[]]
  >();
});

describe("data-last", () => {
  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], partition(constant(true)))).toEqualTypeOf<
      [(number | string)[], (number | string)[]]
    >();
  });

  test("partition with type guard", () => {
    expectTypeOf(pipe([1, "a", 2, "b"], partition(isNumber))).toEqualTypeOf<
      [number[], string[]]
    >();
  });
});
