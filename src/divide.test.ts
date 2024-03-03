import { divide } from "./divide";

test("data-first", () => {
  expect(divide(12, 3)).toEqual(4);
});

test("data-last", () => {
  expect(divide(3)(12)).toEqual(4);
});
