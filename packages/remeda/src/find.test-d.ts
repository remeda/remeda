import { expectTypeOf, test } from "vitest";
import { find } from "./find";
import { isString } from "./isString";
import { isArray } from "./isArray";

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
