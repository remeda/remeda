import { expect, test } from "vitest";
import { purry } from "./purry";

test("all arguments", () => {
  expect(fn(10, 5)).toBe(5);
});

test("1 extra", () => {
  expect(fn(10, 5, 1)).toBe(5);
});

test("1 missing", () => {
  expect((fn(5) as (b: number) => number)(10)).toBe(5);
});

test("2 missing", () => {
  expect(clampFn(5)).toBeTypeOf("function");
});

test("as a callback, the extra arguments run it data-first", () => {
  // the 2nd `index` argument is used in the callback.
  expect([10, 20, 30].map(fn)).toStrictEqual([10, 19, 28]);
});

function fn(...args: readonly unknown[]): unknown {
  return purry(sub, args);
}

function sub(a: number, b: number): number {
  return a - b;
}

function clampFn(...args: readonly unknown[]): unknown {
  return purry(clamp, args);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
