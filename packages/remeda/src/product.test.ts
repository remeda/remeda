import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { product } from "./product";

describe("dataFirst", () => {
  test("should return the product of numbers in the array", () => {
    expect(product([1, 2, 3])).toBe(6);
    expect(product([4, 5, 6])).toBe(120);
    expect(product([0, 1, 2])).toBe(0);
    expect(product([-1, -2, -3])).toBe(-6);
  });

  test("should return 1 for an empty array", () => {
    expect(product([])).toBe(1);
  });

  test("works with bigints", () => {
    expect(product([1n, 2n, 3n])).toBe(6n);
  });

  test("a single number", () => {
    expect(product([5])).toBe(5);
  });

  test("a single bigint", () => {
    expect(product([5n])).toBe(5n);
  });

  test("keeps -0", () => {
    expect(product([-0])).toBe(-0);
  });

  test("propagates NaN", () => {
    expect(product([2, NaN, 3])).toBeNaN();
  });

  test("reads holes as undefined", () => {
    // @ts-expect-error [ts2322] -- A hole reads as `undefined`, which the types reject.
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(product([2, , 3])).toBeNaN();
  });

  test("throws on a hole in a bigint array", () => {
    // @ts-expect-error [ts2322] -- A hole reads as `undefined`, which the types reject.
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(() => product([2n, , 3n])).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("throws on a number after bigints", () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => product([2n, 3])).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("throws on a bigint after numbers", () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => product([2, 3n])).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("throws on the first item of the other type", () => {
    const data = [2n, 3n, 4];
    // Reading past the item that mixes the types throws a different error.
    Object.defineProperty(data, 3, {
      get: () => {
        throw new Error("Read past the mixed item");
      },
    });

    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => product(data)).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });
});

describe("dataLast", () => {
  test("should return the product of numbers in the array", () => {
    expect(pipe([1, 2, 3], product())).toBe(6);
    expect(pipe([4, 5, 6], product())).toBe(120);
    expect(pipe([0, 1, 2], product())).toBe(0);
    expect(pipe([-1, -2, -3], product())).toBe(-6);
  });

  test("should return 1 for an empty array", () => {
    expect(pipe([], product())).toBe(1);
  });

  test("throws like data-first on mixed bigint and number", () => {
    // @ts-expect-error [ts2345] -- The types reject mixing bigint and number.
    expect(() => pipe([2n, 3], product())).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("throws like data-first on a hole in a bigint array", () => {
    // @ts-expect-error [ts2345] -- A hole reads as `undefined`, which the types reject.
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(() => pipe([2n, , 3n], product())).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });
});

describe("known issues!", () => {
  test("returns 1 (`number`) instead of 1n (`bigint`) for empty `bigint` arrays", () => {
    const result = product([] as bigint[]);

    expect(result).toBe(1);
  });
});
