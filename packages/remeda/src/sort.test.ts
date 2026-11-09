import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { sort } from "./sort";

describe("data_first", () => {
  test("sort", () => {
    expect(sort([4, 2, 7, 5], (a, b) => a - b)).toStrictEqual([2, 4, 5, 7]);
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
