import { expect, test } from "vitest";
import { multiply } from "./multiply";

test("data-first", () => {
  expect(multiply(3, 4)).toBe(12);
});

test("data-last", () => {
  expect(multiply(4)(3)).toBe(12);
});
