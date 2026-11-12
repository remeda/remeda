import { expect, test } from "vitest";
import { clamp } from "./clamp";
import { pipe } from "./pipe";

test("min value", () => {
  expect(clamp(10, { min: 20 })).toBe(20);
});

test("max value", () => {
  expect(clamp(10, { max: 5 })).toBe(5);
});

test("ok value", () => {
  expect(clamp(10, { max: 20, min: 5 })).toBe(10);
});

test("data-last", () => {
  expect(pipe(10, clamp({ max: 5 }))).toBe(5);
});
