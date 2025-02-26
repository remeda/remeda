import { add } from "./add";

test("data-first", () => {
  expect(add(10, 5)).toBe(15);
  expect(add(10, -5)).toBe(5);
});

test("data-last", () => {
  expect(add(5)(10)).toBe(15);
  expect(add(-5)(10)).toBe(5);
});
