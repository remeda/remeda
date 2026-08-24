import { expectTypeOf, test } from "vitest";
import { findLast } from "./findLast";
import { isString } from "./isString";

test("can narrow types", () => {
  const result = findLast([1, "a"], isString);

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});

test("narrows when the predicate is wider than the item", () => {
  const result = findLast([[1], "a"] as (number[] | string)[], isReadonlyArray);

  expectTypeOf(result).toEqualTypeOf<number[] | undefined>();
});

test("predicate disjoint from the item", () => {
  const result = findLast([] as number[], isReadonlyArray);

  expectTypeOf(result).toEqualTypeOf<undefined>();
});

const isReadonlyArray = (value: unknown): value is readonly unknown[] =>
  Array.isArray(value);
