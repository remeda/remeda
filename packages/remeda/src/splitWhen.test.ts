import { expect, test } from "vitest";
import { splitWhen } from "./splitWhen";

test("should split array", () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3] as const, (x) => x === 2)).toStrictEqual([
    [1],
    [2, 3, 1, 2, 3],
  ]);
});

test("should with no matches", () => {
  const n = 1232;

  expect(splitWhen([1, 2, 3, 1, 2, 3], (x) => x === n)).toStrictEqual([
    [1, 2, 3, 1, 2, 3],
    [],
  ]);
});
