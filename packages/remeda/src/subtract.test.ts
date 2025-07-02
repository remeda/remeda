import { expect, test } from "vitest";
import { subtract } from "./subtract";

test("data-first", () => {
  expect(subtract(10, 5)).toBe(5);
  expect(subtract(10, -5)).toBe(15);
});

test("data-last", () => {
  expect(subtract(5)(10)).toBe(5);
  expect(subtract(-5)(10)).toBe(15);
});
