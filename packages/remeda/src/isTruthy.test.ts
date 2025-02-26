import { isTruthy } from "./isTruthy";

test("isTruthy", () => {
  expect(isTruthy({ a: "asd" })).toBe(true);
});
