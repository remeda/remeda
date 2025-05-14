import { round } from "./round";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(round(8123.4317, 3)).toBe(8123.432);
    expect(round(483.222_43, 1)).toBe(483.2);
    expect(round(123.4317, 5)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(round(8123.4317, -2)).toBe(8100);
    expect(round(8123.4317, -4)).toBe(10_000);
  });

  // Makes sure the issue github.com/remeda/remeda/issues/1003 doesn't happen.
  test("does not output floating point number for negative precision", () => {
    expect(round(123_456, -5)).toBe(100_000);
  });

  test("should work with precision = 0", () => {
    expect(round(8123.4317, 0)).toBe(8123);
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "should throw for %d precision",
    (val) => {
      expect(() => round(1, val)).toThrow(
        `precision must be an integer: ${val}`,
      );
    },
  );

  test("should throw for non integer precision", () => {
    expect(() => round(1, 21.37)).toThrow(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => round(1, 16)).toThrow("precision must be between -15 and 15");
    expect(() => round(1, -16)).toThrow("precision must be between -15 and 15");
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(val, precision)).toBe(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(round(3)(8123.4317)).toBe(8123.432);
    expect(round(1)(483.222_43)).toBe(483.2);
    expect(round(5)(123.4317)).toBe(123.4317);
  });

  test("should work with negative precision", () => {
    expect(round(-2)(8123.4317)).toBe(8100);
    expect(round(-4)(8123.4317)).toBe(10_000);
  });

  test("should work with precision = 0", () => {
    expect(round(0)(8123.4317)).toBe(8123);
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "should throw for %d precision",
    (val) => {
      expect(() => round(val)(1)).toThrow(
        `precision must be an integer: ${val}`,
      );
    },
  );

  test("should throw for non integer precision", () => {
    expect(() => round(21.37)(1)).toThrow(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => round(16)(1)).toThrow("precision must be between -15 and 15");
    expect(() => round(-16)(1)).toThrow("precision must be between -15 and 15");
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(precision)(val)).toBe(val);
      }
    },
  );
});

test("inconsistencies due to IEEE 754 double-precision floating-point inaccuracies (Issue #1051)", () => {
  // @see https://github.com/remeda/remeda/issues/1051
  expect(round(2.345, 2)).toBe(2.35);
  expect(round(2.135, 2)).toBe(2.14);
});
