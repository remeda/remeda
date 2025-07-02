import { expect, test } from "vitest";
import { clamp } from "./clamp";

test("min value", () => {
  expect(clamp(10, { min: 20 })).toBe(20);
});

test("max value", () => {
  expect(clamp(10, { max: 5 })).toBe(5);
});

test("ok value", () => {
  expect(clamp(10, { max: 20, min: 5 })).toBe(10);
});
