import { floor } from "./floor";

describe("data-first", () => {
  test("should work with positive precision", () => {
    expect(floor(8123.4317, 3)).toEqual(8123.431);
    expect(floor(483.222_43, 1)).toEqual(483.2);
    expect(floor(123.4317, 5)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(floor(8123.4317, -2)).toEqual(8100);
    expect(floor(8123.4317, -4)).toEqual(0);
  });

  test("should work with precision = 0", () => {
    expect(floor(8123.4317, 0)).toEqual(8123);
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "should throw for %d precision",
    (val) => {
      expect(() => floor(1, val)).toThrowError(
        `precision must be an integer: ${val}`,
      );
    },
  );

  test("should throw for non integer precision", () => {
    expect(() => floor(1, 21.37)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => floor(1, 16)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => floor(1, -16)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(val, precision)).toStrictEqual(val);
      }
    },
  );
});

describe("data-last", () => {
  test("should work with positive precision", () => {
    expect(floor(3)(8123.4317)).toEqual(8123.431);
    expect(floor(1)(483.222_43)).toEqual(483.2);
    expect(floor(5)(123.4317)).toEqual(123.4317);
  });

  test("should work with negative precision", () => {
    expect(floor(-2)(8123.4317)).toEqual(8100);
    expect(floor(-4)(8123.4317)).toEqual(0);
  });

  test("should work with precision = 0", () => {
    expect(floor(0)(8123.4317)).toEqual(8123);
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "should throw for %d precision",
    (val) => {
      expect(() => floor(val)(1)).toThrowError(
        `precision must be an integer: ${val}`,
      );
    },
  );

  test("should throw for non integer precision", () => {
    expect(() => floor(21.37)(1)).toThrowError(
      "precision must be an integer: 21.37",
    );
  });

  test("should throw for precision higher than 15 and lower than -15", () => {
    expect(() => floor(16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
    expect(() => floor(-16)(1)).toThrowError(
      "precision must be between -15 and 15",
    );
  });

  test.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "should return %d when passed as value regardless of precision",
    (val) => {
      for (const precision of [-1, 0, 1]) {
        expect(floor(precision)(val)).toStrictEqual(val);
      }
    },
  );
});
