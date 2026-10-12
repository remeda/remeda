import { expect, test } from "vitest";
import { purryWithLazy } from "./purryWithLazy";
import type { LazyEvaluator } from "./types/LazyEvaluator";

test("all arguments", () => {
  expect(fn(10, 5)).toBe(5);
});

test("1 extra", () => {
  expect(fn(10, 5, 1)).toBe(5);
});

test("1 missing", () => {
  expect((fn(5) as (b: number) => number)(10)).toBe(5);
});

function fn(...args: readonly unknown[]): unknown {
  return purryWithLazy(sub, args, lazy);
}

function sub(a: number, b: number): number {
  return a - b;
}

const passThrough: LazyEvaluator = (item) => item;

// Only `pipe` runs the lazy implementation, so these dispatch tests never call
// it.
const lazy = (): LazyEvaluator => passThrough;
