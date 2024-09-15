import { partialBind } from "./partialBind";

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

test("should partially apply 0 args", () => {
  expect(partialBind([], fn)(1, 2, 3)).toBe(fn(1, 2, 3));
});

test("should partially apply 1 arg", () => {
  expect(partialBind([1], fn)(2, 3)).toBe(fn(1, 2, 3));
});

test("should partially apply all args", () => {
  expect(partialBind([1, 2, 3], fn)()).toBe(fn(1, 2, 3));
});
