import { expect, test, describe } from "vitest";
import { isEmptyish } from "./isEmptyish";

test("nullish", () => {
  expect(isEmptyish(null)).toBe(true);
  expect(isEmptyish(undefined)).toBe(true);
});

test("strings", () => {
  expect(isEmptyish("")).toBe(true);
  expect(isEmptyish("test")).toBe(false);
});

test("arrays", () => {
  expect(isEmptyish([])).toBe(true);
  // eslint-disable-next-line unicorn/new-for-builtins
  expect(isEmptyish(Array(0))).toBe(true);
  // eslint-disable-next-line unicorn/no-new-array
  expect(isEmptyish(new Array(0))).toBe(true);
  expect(isEmptyish(Array.from({ length: 0 }))).toBe(true);

  expect(isEmptyish([1, 2, 3])).toBe(false);
  // eslint-disable-next-line no-sparse-arrays
  expect(isEmptyish([, ,])).toBe(false);
  // eslint-disable-next-line unicorn/new-for-builtins
  expect(isEmptyish(Array(10))).toBe(false);
  // eslint-disable-next-line unicorn/no-new-array
  expect(isEmptyish(new Array(10))).toBe(false);
  expect(isEmptyish(Array.from({ length: 10 }))).toBe(false);
});

test("plain objects", () => {
  expect(isEmptyish({})).toBe(true);
  expect(isEmptyish({ key: "value" })).toBe(false);
});

test("maps", () => {
  expect(isEmptyish(new Map())).toBe(true);
  expect(isEmptyish(new Map([["key", "value"]]))).toBe(false);
});

test("sets", () => {
  expect(isEmptyish(new Set())).toBe(true);
  expect(isEmptyish(new Set([1, 2, 3]))).toBe(false);
});

test("typed arrays", () => {
  expect(isEmptyish(new Uint8Array())).toBe(true);
  expect(isEmptyish(new Uint8Array([1, 2, 3]))).toBe(false);
});

test("buffers", () => {
  expect(isEmptyish(Buffer.alloc(0))).toBe(true);
  expect(isEmptyish(Buffer.alloc(3))).toBe(false);
});

test("array-like (arguments)", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function empty(): void {
    // eslint-disable-next-line prefer-rest-params
    expect(isEmptyish(arguments)).toBe(true);
  }
  empty();

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function nonEmpty(_p0: string, _p1: number, _p2: boolean): void {
    // eslint-disable-next-line prefer-rest-params
    expect(isEmptyish(arguments)).toBe(false);
  }
  nonEmpty("test", 123, true);
});

test("arbitrary sized objects", () => {
  expect(isEmptyish({ length: 0 })).toBe(true);
  expect(isEmptyish({ length: 1 })).toBe(false);
  expect(isEmptyish({ size: 0 })).toBe(true);
  expect(isEmptyish({ size: 1 })).toBe(false);
});

describe("unsupported types", () => {
  test("numbers", () => {
    expect(isEmptyish(0)).toBe(false);
    expect(isEmptyish(Number.NaN)).toBe(false);
    expect(isEmptyish(Infinity)).toBe(false);
  });

  test("booleans", () => {
    expect(isEmptyish(false)).toBe(false);
    expect(isEmptyish(true)).toBe(false);
  });

  test("bigints", () => {
    expect(isEmptyish(0n)).toBe(false);
    expect(isEmptyish(1n)).toBe(false);
  });

  test("symbols", () => {
    expect(isEmptyish(Symbol(""))).toBe(false);
    expect(isEmptyish(Symbol("something"))).toBe(false);
  });

  test("classes", () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class Empty {}
    class NonEmpty {
      public a = "hello";
    }

    expect(isEmptyish(new Empty())).toBe(false);
    expect(isEmptyish(new NonEmpty())).toBe(false);
  });

  test("regexp", () => {
    expect(isEmptyish(/abc/u)).toBe(false);
    // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
    expect(isEmptyish(new RegExp(""))).toBe(false);
  });

  test("dates", () => {
    expect(isEmptyish(new Date(0))).toBe(false);
    expect(isEmptyish(new Date())).toBe(false);
  });

  test("functions", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isEmptyish(() => {})).toBe(false);
    expect(
      isEmptyish(() => {
        // eslint-disable-next-line no-console
        console.log("hello");
      }),
    ).toBe(false);
  });
});
