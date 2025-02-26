import { divide } from "./divide";

test("data-first", () => {
  expect(divide(12, 3)).toBe(4);
});

test("data-last", () => {
  expect(divide(3)(12)).toBe(4);
});
