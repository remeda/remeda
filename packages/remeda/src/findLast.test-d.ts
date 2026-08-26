import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { findLast } from "./findLast";
import { isArray } from "./isArray";
import { isString } from "./isString";
import { pipe } from "./pipe";

test("can narrow types", () => {
  expectTypeOf(findLast([1, "a"], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    findLast([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(findLast([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("non-guard predicate", () => {
  expectTypeOf(findLast([1, "a"], constant(true))).toEqualTypeOf<
    number | string | undefined
  >();
});

describe("data-last", () => {
  test("narrowing predicate", () => {
    expectTypeOf(pipe([1, "a"], findLast(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  test("predicate is wider than the item", () => {
    expectTypeOf(
      pipe([[1], "a"] as (number[] | string)[], findLast(isArray)),
    ).toEqualTypeOf<number[] | undefined>();
  });

  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], findLast(constant(true)))).toEqualTypeOf<
      number | string | undefined
    >();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(
      pipe([] as number[], findLast(isArray)),
    ).toEqualTypeOf<undefined>();
  });
});
