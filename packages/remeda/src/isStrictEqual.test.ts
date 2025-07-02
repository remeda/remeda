import { describe, expect, test } from "vitest";
import { isStrictEqual } from "./isStrictEqual";

describe("primitives", () => {
  test("undefined", () => {
    expect(isStrictEqual(undefined, undefined)).toBe(true);
  });

  test("null", () => {
    expect(isStrictEqual(null, null)).toBe(true);
  });

  test("string", () => {
    expect(isStrictEqual("a", "a")).toBe(true);
    expect(isStrictEqual("a", "b")).toBe(false);
  });

  test("number", () => {
    expect(isStrictEqual(1, 1)).toBe(true);
    expect(isStrictEqual(1, 2)).toBe(false);
  });

  test("boolean", () => {
    expect(isStrictEqual(true, true)).toBe(true);
    expect(isStrictEqual(true, false)).toBe(false);
  });

  test("bigint", () => {
    expect(isStrictEqual(1n, 1n)).toBe(true);
    expect(isStrictEqual(1n, 2n)).toBe(false);
  });
});

describe("objects", () => {
  test("arrays", () => {
    const data = [1, 2, 3];

    expect(isStrictEqual(data, [1, 2, 3])).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("objects", () => {
    const data = { a: 1, b: 2 };

    expect(isStrictEqual(data, { a: 1, b: 2 })).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("uint arrays", () => {
    const data = new Uint8Array([1, 2, 3]);

    expect(isStrictEqual(data, new Uint8Array([1, 2, 3]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("maps", () => {
    const data = new Map([["a", 1]]);

    expect(isStrictEqual(data, new Map([["a", 1]]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("sets", () => {
    const data = new Set([1, 2, 3]);

    expect(isStrictEqual(data, new Set([1, 2, 3]))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });
});

describe("built-ins", () => {
  test("regex", () => {
    const data = /a/u;

    expect(isStrictEqual(data, /a/u)).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("dates", () => {
    const data = new Date();

    expect(isStrictEqual(data, new Date())).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });

  test("promises", () => {
    const data = Promise.resolve(1);

    expect(isStrictEqual(data, Promise.resolve(1))).toBe(false);
    expect(isStrictEqual(data, data)).toBe(true);
  });
});

describe("special cases", () => {
  test("literal NaN", () => {
    // eslint-disable-next-line unicorn/prefer-number-properties
    expect(isStrictEqual(NaN, NaN)).toBe(true);
    expect(isStrictEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  test("-0", () => {
    expect(isStrictEqual(-0, 0)).toBe(true);
    expect(isStrictEqual(-0, -0)).toBe(true);
    expect(isStrictEqual(0, 0)).toBe(true);
  });

  test("fails on loose equality", () => {
    expect(isStrictEqual("" as unknown, 0)).toBe(false);
    expect(isStrictEqual("" as unknown, false)).toBe(false);
    expect(isStrictEqual(0 as unknown, false)).toBe(false);
    expect(isStrictEqual("" as unknown, null)).toBe(false);
    expect(isStrictEqual("" as unknown, undefined)).toBe(false);
    expect(isStrictEqual(0 as unknown, null)).toBe(false);
    expect(isStrictEqual(0 as unknown, undefined)).toBe(false);
    expect(isStrictEqual(false as unknown, null)).toBe(false);
    expect(isStrictEqual(false as unknown, undefined)).toBe(false);
  });
});
