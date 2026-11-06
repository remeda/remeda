import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { sort } from "./sort";

describe("data_first", () => {
  test("sort", () => {
    expect(sort([4, 2, 7, 5], (a, b) => a - b)).toStrictEqual([2, 4, 5, 7]);
  });

  test("keeps holes", () => {
    expect(sort([3, , 1], (a = 0, b = 0) => a - b)).toStrictEqual([1, 3, ,]);
  });
});

describe("data_last", () => {
  test("sort", () => {
    expect(
      pipe(
        [4, 2, 7, 5],
        sort((a, b) => a - b),
      ),
    ).toStrictEqual([2, 4, 5, 7]);
  });
});
