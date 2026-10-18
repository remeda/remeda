import { describe, expect, test } from "vitest";
import { last } from "./last";
import { pipe } from "./pipe";

describe("data first", () => {
  test("should return last", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  test("empty array", () => {
    expect(last([])).toBeUndefined();
  });

  test("a single item", () => {
    expect(last([5])).toBe(5);
  });

  test("returns the last of same-shape objects by reference", () => {
    const first = { id: 0 };
    const second = { id: 0 };

    expect(last([first, second])).toBe(second);
  });

  test("reads a trailing hole as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(last([1, ,])).toBeUndefined();
  });

  test("keeps -0", () => {
    expect(last([1, -0])).toBe(-0);
  });

  test("returns a trailing NaN", () => {
    expect(last([1, NaN])).toBeNaN();
  });
});

describe("data last", () => {
  test("should return last", () => {
    expect(pipe([1, 2, 3], last())).toBe(3);
  });

  test("empty array", () => {
    expect(pipe([], last())).toBeUndefined();
  });
});
