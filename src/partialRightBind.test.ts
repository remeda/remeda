import { partialRightBind } from "./partialRightBind";

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

test("should partially apply 0 args", () => {
  expect(partialRightBind(fn, [])(1, 2, 3)).toBe(fn(1, 2, 3));
});

test("should partially apply 1 arg", () => {
  expect(partialRightBind(fn, [3])(1, 2)).toBe(fn(1, 2, 3));
});

test("should partially apply all args", () => {
  expect(partialRightBind(fn, [1, 2, 3])()).toBe(fn(1, 2, 3));
});
