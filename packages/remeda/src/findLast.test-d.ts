import { expectTypeOf, test } from "vitest";
import { findLast } from "./findLast";
import { isArray } from "./isArray";
import { isString } from "./isString";

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
