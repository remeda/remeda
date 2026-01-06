import { expect, test } from "vitest";
import { purry } from "./purry";

function sub(a: number, b: number): number {
  return a - b;
}

function fn(...args: readonly unknown[]): unknown {
  return purry(sub, args);
}

test("all arguments", () => {
  expect(fn(10, 5)).toBe(5);
});

test("1 missing", () => {
  const purried = fn(5) as (...args: readonly unknown[]) => unknown;

  expect(purried(10)).toBe(5);
});

test("wrong number of arguments", () => {
  expect(() => fn(5, 10, 40)).toThrowError("Wrong number of arguments");
});
