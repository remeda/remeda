import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { find } from "./find";
import { isArray } from "./isArray";
import { isString } from "./isString";
import { pipe } from "./pipe";

test("can narrow types", () => {
  expectTypeOf(find([1, "a"], isString)).toEqualTypeOf<string | undefined>();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    find([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("narrows tuples down to the matching item", () => {
  expectTypeOf(find([1, "a", true] as [1, "a", true], isString)).toEqualTypeOf<
    "a" | undefined
  >();
});

test("accepts a union of array types", () => {
  expectTypeOf(find([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(find([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("non-guard predicate", () => {
  expectTypeOf(find([1, "a"], constant(true))).toEqualTypeOf<
    number | string | undefined
  >();
});

describe("data-last", () => {
  test("narrowing predicate", () => {
    expectTypeOf(pipe([1, "a"], find(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  test("predicate is wider than the item", () => {
    expectTypeOf(
      pipe([[1], "a"] as (number[] | string)[], find(isArray)),
    ).toEqualTypeOf<number[] | undefined>();
  });

  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], find(constant(true)))).toEqualTypeOf<
      number | string | undefined
    >();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(
      pipe([] as number[], find(isArray)),
    ).toEqualTypeOf<undefined>();
  });
});
