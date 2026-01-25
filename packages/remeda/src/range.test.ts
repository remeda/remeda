import { describe, expect, test } from "vitest";
import { range } from "./range";

describe("data first", () => {
  test("range", () => {
    expect(range(1, 5)).toStrictEqual([1, 2, 3, 4]);
  });

  test("range with step", () => {
    expect(range(1, 20, 5)).toStrictEqual([1, 6, 11, 16]);
  });

  test("range with negative step", () => {
    expect(range(20, 1, -5)).toStrictEqual([20, 15, 10, 5]);
  });

  test("range with step 2", () => {
    expect(range(0, 10, 2)).toStrictEqual([0, 2, 4, 6, 8]);
  });
});

describe("data last", () => {
  test("range", () => {
    expect(range(5)(1)).toStrictEqual([1, 2, 3, 4]);
  });
});
