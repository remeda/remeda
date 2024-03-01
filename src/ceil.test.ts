import { ceil } from "./ceil";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(ceil(8123.4317, 3)).toEqual(8123.432);
    expect(ceil(483.22243, 1)).toEqual(483.3);
    expect(ceil(123.4317, 5)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(ceil(8123.4317, -2)).toEqual(8200);
    expect(ceil(8123.4317, -4)).toEqual(10000);
  });

  test("should work with precision = 0", () => {
    expect(ceil(8123.4317, 0)).toEqual(8124);
  });

  test.each([NaN, Infinity])("should throw for %d precision", (val) => {
    expect(() => ceil(1, val)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  test("should throw for non integer precision", () => {
    expect(() => ceil(1, 21.37)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => ceil(1, 16)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => ceil(1, -16)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(ceil(val, precision)).toStrictEqual(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(ceil(3)(8123.4317)).toEqual(8123.432);
    expect(ceil(1)(483.22243)).toEqual(483.3);
    expect(ceil(5)(123.4317)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(ceil(-2)(8123.4317)).toEqual(8200);
    expect(ceil(-4)(8123.4317)).toEqual(10000);
  });

  test("should work with precision = 0", () => {
    expect(ceil(0)(8123.4317)).toEqual(8124);
  });

  test.each([NaN, Infinity])("should throw for %d precision", (val) => {
    expect(() => ceil(val)(1)).toThrowError(
      `precision must be an integer: ${val}`,
    );
  });

  test("should throw for non integer precision", () => {
    expect(() => ceil(21.37)(1)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => ceil(-16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => ceil(16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([NaN, Infinity, -Infinity])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(ceil(precision)(val)).toStrictEqual(val);
      }
    },
  );
});
