import { describe, expect, test } from "vitest";
import { median } from "./median";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("arrays of odd length", () => {
    expect(median([6, 10, 11])).toBe(10);
  });

  test("arrays of even length", () => {
    expect(median([1, 2, 3, 9])).toBe(2.5);
    expect(median([-1, 0, 1, 10])).toBe(0.5);
  });

  test("should return undefined for an empty array", () => {
    expect(median([])).toBeUndefined();
  });
});

describe("dataLast", () => {
  test("arrays of odd length", () => {
    expect(pipe([6, 10, 11], median())).toBe(10);
  });

  test("arrays of even length", () => {
    expect(pipe([1, 2, 3, 9], median())).toBe(2.5);
    expect(pipe([-1, 0, 1, 10], median())).toBe(0.5);
  });

  test("should return undefined for an empty array", () => {
    expect(pipe([], median())).toBeUndefined();
  });
});
