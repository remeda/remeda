import { round } from "./round";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(round(8123.4317, 3)).toEqual(8123.432);
    expect(round(483.22243, 1)).toEqual(483.2);
    expect(round(123.4317, 5)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(round(8123.4317, -2)).toEqual(8100);
    expect(round(8123.4317, -4)).toEqual(10000);
  });

  test("should work with precision = 0", () => {
    expect(round(8123.4317, 0)).toEqual(8123);
  });

  test.each([NaN, Infinity])("should throw for %d precision", (val) => {
    expect(() => round(1, val)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  test("should throw for non integer precision", () => {
    expect(() => round(1, 21.37)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => round(1, 16)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => round(1, -16)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(val, precision)).toStrictEqual(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(round(3)(8123.4317)).toEqual(8123.432);
    expect(round(1)(483.22243)).toEqual(483.2);
    expect(round(5)(123.4317)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(round(-2)(8123.4317)).toEqual(8100);
    expect(round(-4)(8123.4317)).toEqual(10000);
  });

  test("should work with precision = 0", () => {
    expect(round(0)(8123.4317)).toEqual(8123);
  });

  test.each([NaN, Infinity])("should throw for %d precision", (val) => {
    expect(() => round(val)(1)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  test("should throw for non integer precision", () => {
    expect(() => round(21.37)(1)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => round(16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => round(-16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(round(precision)(val)).toStrictEqual(val);
      }
    },
  );
});
