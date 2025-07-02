import { describe, expect, it } from "vitest";
import { pipe } from "./pipe";
import { product } from "./product";

describe("dataFirst", () => {
  it("should return the product of numbers in the array", () => {
    expect(product([1, 2, 3])).toBe(6);
    expect(product([4, 5, 6])).toBe(120);
    expect(product([0, 1, 2])).toBe(0);
    expect(product([-1, -2, -3])).toBe(-6);
  });

  it("should return 1 for an empty array", () => {
    expect(product([])).toBe(1);
  });

  it("works with bigints", () => {
    expect(product([1n, 2n, 3n])).toBe(6n);
  });
});

describe("dataLast", () => {
  it("should return the product of numbers in the array", () => {
    expect(pipe([1, 2, 3], product())).toBe(6);
    expect(pipe([4, 5, 6], product())).toBe(120);
    expect(pipe([0, 1, 2], product())).toBe(0);
    expect(pipe([-1, -2, -3], product())).toBe(-6);
  });

  it("should return 1 for an empty array", () => {
    expect(pipe([], product())).toBe(1);
  });
});

describe("KNOWN ISSUES", () => {
  it("returns 1 (`number`) instead of 1n (`bigint`) for empty `bigint` arrays", () => {
    const result = product([] as Array<bigint>);

    expect(result).toBe(1);
  });
});
