import { describe, expect, test } from "vitest";
import { floor } from "./floor";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(floor(8123.4317, 3)).toBe(8123.431);
    expect(floor(483.22243, 1)).toBe(483.2);
    expect(floor(123.4317, 5)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(floor(8123.4317, -2)).toBe(8100);
    expect(floor(8123.4317, -4)).toBe(0);
  });

  // Makes sure the issue github.com/remeda/remeda/issues/1003 doesn't happen.
  test("does not output floating point number for negative precision", () => {
    expect(floor(123_456, -5)).toBe(100_000);
  });

  test("should work with precision = 0", () => {
    expect(floor(8123.4317, 0)).toBe(8123);
  });

  test("should throw for NaN precision", () => {
    expect(() => floor(1, NaN)).toThrow("precision must be an integer: NaN");
  });

  test("should throw for non integer precision", () => {
    expect(() => floor(1, 2.137)).toThrow(
      "precision must be an integer: 2.137",
    );
  });

  test.each([16, -16, 21.37, Infinity, 2 ** 53])(
    "should throw for out-of-range precision %d",
    (val) => {
      expect(() => floor(1, val)).toThrow(
        "precision must be between -15 and 15",
      );
    },
  );

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(val, precision)).toBe(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(floor(3)(8123.4317)).toBe(8123.431);
    expect(floor(1)(483.22243)).toBe(483.2);
    expect(floor(5)(123.4317)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(floor(-2)(8123.4317)).toBe(8100);
    expect(floor(-4)(8123.4317)).toBe(0);
  });

  test("should work with precision = 0", () => {
    expect(floor(0)(8123.4317)).toBe(8123);
  });

  test("should throw for NaN precision", () => {
    expect(() => floor(NaN)(1)).toThrow("precision must be an integer: NaN");
  });

  test("should throw for non integer precision", () => {
    expect(() => floor(2.137)(1)).toThrow(
      "precision must be an integer: 2.137",
    );
  });

  test.each([16, -16, 21.37, Infinity, 2 ** 53])(
    "should throw for out-of-range precision %d",
    (val) => {
      expect(() => floor(val)(1)).toThrow(
        "precision must be between -15 and 15",
      );
    },
  );

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(precision)(val)).toBe(val);
      }
    },
  );
});
