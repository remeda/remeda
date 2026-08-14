import { describe, expect, test } from "vitest";
import { ceil } from "./ceil";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(ceil(8123.4317, 3)).toBe(8123.432);
    expect(ceil(483.22243, 1)).toBe(483.3);
    expect(ceil(123.4317, 5)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(ceil(8123.4317, -2)).toBe(8200);
    expect(ceil(8123.4317, -4)).toBe(10_000);
  });

  // Makes sure the issue github.com/remeda/remeda/issues/1003 doesn't happen.
  test("does not output floating point number for negative precision", () => {
    expect(ceil(123_456, -5)).toBe(200_000);
  });

  test("should work with precision = 0", () => {
    expect(ceil(8123.4317, 0)).toBe(8124);
  });

  test("should throw for NaN precision", () => {
    expect(() => ceil(1, NaN)).toThrow("precision must be an integer: NaN");
  });

  test("should throw for non integer precision", () => {
    expect(() => ceil(1, 2.137)).toThrow("precision must be an integer: 2.137");
  });

  test.each([16, -16, 21.37, Infinity, 2 ** 53])(
    "should throw for out-of-range precision %d",
    (val) => {
      expect(() => ceil(1, val)).toThrow(
        "precision must be between -15 and 15",
      );
    },
  );

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(ceil(val, precision)).toBe(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(ceil(3)(8123.4317)).toBe(8123.432);
    expect(ceil(1)(483.22243)).toBe(483.3);
    expect(ceil(5)(123.4317)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(ceil(-2)(8123.4317)).toBe(8200);
    expect(ceil(-4)(8123.4317)).toBe(10_000);
  });

  test("should work with precision = 0", () => {
    expect(ceil(0)(8123.4317)).toBe(8124);
  });

  test("should throw for NaN precision", () => {
    expect(() => ceil(NaN)(1)).toThrow("precision must be an integer: NaN");
  });

  test("should throw for non integer precision", () => {
    expect(() => ceil(2.137)(1)).toThrow("precision must be an integer: 2.137");
  });

  test.each([16, -16, 21.37, Infinity, 2 ** 53])(
    "should throw for out-of-range precision %d",
    (val) => {
      expect(() => ceil(val)(1)).toThrow(
        "precision must be between -15 and 15",
      );
    },
  );

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(ceil(precision)(val)).toBe(val);
      }
    },
  );
});
