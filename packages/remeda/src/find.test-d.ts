import { expectTypeOf, test } from "vitest";
import { find } from "./find";
import { isString } from "./isString";

test("can narrow types", () => {
  const result = find([1, "a"], isString);

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});

test("narrows when the predicate is wider than the item", () => {
  const result = find([[1], "a"] as (number[] | string)[], isReadonlyArray);

  expectTypeOf(result).toEqualTypeOf<number[] | undefined>();
});

test("narrows tuples down to the matching item", () => {
  const result = find([1, "a", true] as [1, "a", true], isString);

  expectTypeOf(result).toEqualTypeOf<"a" | undefined>();
});

test("accepts a union of array types", () => {
  const result = find([] as string[] | number[], isString);

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});

test("predicate disjoint from the item", () => {
  const result = find([] as number[], isReadonlyArray);

  expectTypeOf(result).toEqualTypeOf<undefined>();
});

const isReadonlyArray = (value: unknown): value is readonly unknown[] =>
  Array.isArray(value);
