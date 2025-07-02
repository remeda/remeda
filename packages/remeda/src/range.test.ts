import { describe, expect, test } from "vitest";
import { range } from "./range";

describe("data first", () => {
  test("range", () => {
    expect(range(1, 5)).toStrictEqual([1, 2, 3, 4]);
  });
});

describe("data last", () => {
  test("range", () => {
    expect(range(5)(1)).toStrictEqual([1, 2, 3, 4]);
  });
});
