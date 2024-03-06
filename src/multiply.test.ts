import { multiply } from "./multiply";

test("data-first", () => {
  expect(multiply(3, 4)).toEqual(12);
});

test("data-last", () => {
  expect(multiply(4)(3)).toEqual(12);
});
