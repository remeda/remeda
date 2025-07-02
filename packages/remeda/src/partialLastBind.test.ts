import { expect, test } from "vitest";
import { partialLastBind } from "./partialLastBind";

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

test("should partially apply 0 args", () => {
  expect(partialLastBind(fn)(1, 2, 3)).toBe(fn(1, 2, 3));
});

test("should partially apply 1 arg", () => {
  expect(partialLastBind(fn, 3)(1, 2)).toBe(fn(1, 2, 3));
});

test("should partially apply all args", () => {
  expect(partialLastBind(fn, 1, 2, 3)()).toBe(fn(1, 2, 3));
});
