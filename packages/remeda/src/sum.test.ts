import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { sum } from "./sum";

describe("dataFirst", () => {
  test("should return the sum of numbers in an array", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([4, 5, 6])).toBe(15);
    expect(sum([-1, 0, 1])).toBe(0);
  });

  test("should return 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });

  test("works on bigints", () => {
    expect(sum([1n, 2n, 3n])).toBe(6n);
  });
});

describe("dataLast", () => {
  test("should return the sum of numbers in an array", () => {
    expect(pipe([1, 2, 3], sum())).toBe(6);
    expect(pipe([4, 5, 6], sum())).toBe(15);
    expect(pipe([-1, 0, 1], sum())).toBe(0);
  });

  test("should return 0 for an empty array", () => {
    expect(pipe([], sum())).toBe(0);
  });
});

describe("KNOWN ISSUES", () => {
  test("returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays", () => {
    const result = sum([] as Array<bigint>);

    expect(result).toBe(0);
  });
});
