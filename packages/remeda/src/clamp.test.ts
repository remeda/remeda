import { expect, it } from "vitest";
import { clamp } from "./clamp";

it("min value", () => {
  expect(clamp(10, { min: 20 })).toBe(20);
});

it("max value", () => {
  expect(clamp(10, { max: 5 })).toBe(5);
});

it("ok value", () => {
  expect(clamp(10, { max: 20, min: 5 })).toBe(10);
});
