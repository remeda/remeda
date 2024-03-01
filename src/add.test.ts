import { add } from "./add";

test("data-first", () => {
  expect(add(10, 5)).toEqual(15);
  expect(add(10, -5)).toEqual(5);
});

test("data-last", () => {
  expect(add(5)(10)).toEqual(15);
  expect(add(-5)(10)).toEqual(5);
});
