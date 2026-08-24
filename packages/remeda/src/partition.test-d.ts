import { expectTypeOf, test } from "vitest";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { partition } from "./partition";
import { pipe } from "./pipe";

test("partition with type guard", () => {
  const actual = partition([1, "a", 2, "b"], isNumber);

  expectTypeOf(actual).toEqualTypeOf<[number[], string[]]>();
});

test("partition with type guard in pipe", () => {
  const actual = pipe(
    [1, "a", 2, "b"],
    partition((value): value is number => typeof value === "number"),
  );

  expectTypeOf(actual).toEqualTypeOf<[number[], string[]]>();
});

test("narrows both sides when the predicate is wider than the item", () => {
  const actual = partition(["a", null] as (string | null)[], isNullish);

  expectTypeOf(actual).toEqualTypeOf<[null[], string[]]>();
});

test("narrows tuples down to the matching items", () => {
  const actual = partition([1, "a", true] as [1, "a", true], isString);

  expectTypeOf(actual).toEqualTypeOf<["a"[], (true | 1)[]]>();
});

test("predicate disjoint from the item", () => {
  const actual = partition([] as string[], isNullish);

  expectTypeOf(actual).toEqualTypeOf<[never[], string[]]>();
});

const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
