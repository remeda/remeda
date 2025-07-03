import { describe, expect, test } from "vitest";
import { mean } from "./mean";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("should return the mean of numbers in an array", () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(mean([4, 5, 6])).toBe(5);
    expect(mean([-1, 0, 1])).toBe(0);
  });

  test("should return undefined for an empty array", () => {
    expect(mean([])).toBeUndefined();
  });
});

describe("dataLast", () => {
  test("should return the mean of numbers in an array", () => {
    expect(pipe([1, 2, 3], mean())).toBe(2);
    expect(pipe([4, 5, 6], mean())).toBe(5);
    expect(pipe([-1, 0, 1], mean())).toBe(0);
  });

  test("should return undefined for an empty array", () => {
    expect(pipe([], mean())).toBeUndefined();
  });
});
