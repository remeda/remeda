import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { range } from "./range";

describe("trivial 0 cases", () => {
  test("start at 0", () => {
    expect(range(0, 5)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  test("end at 0", () => {
    expect(range(5, 0)).toStrictEqual([]);
  });

  test("empty range", () => {
    expect(range(0, 0)).toStrictEqual([]);
  });

  test("step 0", () => {
    expect(() => range(0, { end: 5, step: 0 })).toThrow(RangeError);
  });
});

test("simple range", () => {
  expect(range(10, 20)).toStrictEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
});

test("switched bounds", () => {
  expect(range(20, 1)).toStrictEqual([]);
});

describe("data last", () => {
  test("simple range", () => {
    expect(pipe(1, range(5))).toStrictEqual([1, 2, 3, 4]);
  });

  test("with step", () => {
    expect(pipe(1, range({ end: 20, step: 5 }))).toStrictEqual([1, 6, 11, 16]);
  });
});

describe("positive step", () => {
  test("trivial step", () => {
    expect(range(1, { end: 5, step: 1 })).toStrictEqual([1, 2, 3, 4]);
  });

  test("simple step", () => {
    expect(range(1, { end: 20, step: 5 })).toStrictEqual([1, 6, 11, 16]);
  });

  test("step larger than range", () => {
    expect(range(1, { end: 5, step: 100 })).toStrictEqual([1]);
  });

  test("step exactly divides range", () => {
    expect(range(0, { end: 10, step: 5 })).toStrictEqual([0, 5]);
  });
});

describe("negative step", () => {
  test("trivial step", () => {
    expect(range(5, { end: 0, step: -1 })).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("simple decrementing range", () => {
    expect(range(20, { end: 1, step: -5 })).toStrictEqual([20, 15, 10, 5]);
  });

  test("step in wrong direction", () => {
    expect(range(1, { end: 20, step: -5 })).toStrictEqual([]);
  });
});

describe("non-integer inputs", () => {
  test("floating-point start", () => {
    expect(range(0.5, 5)).toStrictEqual([0.5, 1.5, 2.5, 3.5, 4.5]);
  });

  test("floating-point step", () => {
    expect(range(1, { end: 5, step: 0.5 })).toStrictEqual([
      1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5,
    ]);
  });

  test("floating-point end", () => {
    expect(range(1, 5.5)).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

test("double-precision limits", () => {
  expect(
    range(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 5),
  ).toStrictEqual([
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER + 1,
    Number.MAX_SAFE_INTEGER + 2,
    Number.MAX_SAFE_INTEGER + 3,
    Number.MAX_SAFE_INTEGER + 4,
  ]);
});
