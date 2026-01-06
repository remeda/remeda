import { expectTypeOf, test } from "vitest";
import { splice } from "./splice";

test("reflects the type of `items` in the return value", () => {
  const items: number[] = [];
  const result = splice(items, 0, 0, []);

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("reflects the type of `replacement` in the return value", () => {
  const replacement: number[] = [];
  const result = splice([], 0, 0, replacement);

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("reflects the type of `replacement` in the return value (data-last)", () => {
  const replacement: number[] = [];
  const result = splice(0, 0, replacement);

  expectTypeOf(result).toEqualTypeOf<(items: readonly number[]) => number[]>();
});
