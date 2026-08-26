import { expectTypeOf, test } from "vitest";
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

test("partition with type guard in pipe", () => {
  expectTypeOf(pipe([1, "a", 2, "b"], partition(isNumber))).toEqualTypeOf<
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
