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

test("narrows tuples down to the matching item", () => {
  expectTypeOf(
    findLast([1, "a", true] as [1, "a", true], isString),
  ).toEqualTypeOf<"a" | undefined>();
});

test("accepts a union of array types", () => {
  expectTypeOf(findLast([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("readonly tuple", () => {
  expectTypeOf(findLast([1, "a", true] as const, isString)).toEqualTypeOf<
    "a" | undefined
  >();
});

test("predicate is typed correctly", () => {
  findLast([] as (number | string)[], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

    return true;
  });
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

  test("predicate is typed correctly", () => {
    pipe(
      [] as (number | string)[],
      findLast((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

        return true;
      }),
    );
  });
});
