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

test("string objects", () => {
  // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
  expect(isEmptyish(new String(""))).toBe(true);
  // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
  expect(isEmptyish(new String("test"))).toBe(false);
});

test("literal arrays", () => {
  expect(isEmptyish([])).toBe(true);
  expect(isEmptyish([1, 2, 3])).toBe(false);
});

test("sparse arrays", () => {
  // eslint-disable-next-line unicorn/new-for-builtins
  expect(isEmptyish(Array(0))).toBe(true);
  // eslint-disable-next-line unicorn/new-for-builtins
  expect(isEmptyish(Array(10))).toBe(false);

  // eslint-disable-next-line unicorn/no-new-array
  expect(isEmptyish(new Array(0))).toBe(true);
  // eslint-disable-next-line unicorn/no-new-array
  expect(isEmptyish(new Array(10))).toBe(false);

  expect(isEmptyish(Array.from({ length: 0 }))).toBe(true);
  expect(isEmptyish(Array.from({ length: 10 }))).toBe(false);

  // eslint-disable-next-line no-sparse-arrays
  expect(isEmptyish([, ,])).toBe(false);
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

test("array-like (e.g., `arguments`)", () => {
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

test("url search params", () => {
  expect(isEmptyish(new URLSearchParams())).toBe(true);
  expect(isEmptyish(new URLSearchParams(""))).toBe(true);
  expect(isEmptyish(new URLSearchParams("?"))).toBe(true);
  expect(isEmptyish(new URLSearchParams("hello"))).toBe(false);
  expect(isEmptyish(new URLSearchParams({ hello: "world " }))).toBe(false);
});

test("arbitrary sized objects", () => {
  expect(isEmptyish({ length: 0 })).toBe(true);
  expect(isEmptyish({ length: 1 })).toBe(false);
  expect(isEmptyish({ size: 0 })).toBe(true);
  expect(isEmptyish({ size: 1 })).toBe(false);
});

describe("unsupported types", () => {
  // Most assertions in this section return the wrong value semantically and are
  // here to document the expected outputs in those cases for the current
  // implementation. If any of these break due to a change in the runtime
  // implementation they should be fixed and possibly extracted out of this
  // section!

  test("numbers", () => {
    expect(isEmptyish(0)).toBe(false);
    expect(isEmptyish(-0)).toBe(false);
    expect(isEmptyish(Number.NaN)).toBe(false);
    expect(isEmptyish(Infinity)).toBe(false);
    expect(isEmptyish(100)).toBe(false);
    expect(isEmptyish(12.34)).toBe(false);
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
    // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
    expect(isEmptyish(new RegExp(""))).toBe(false);
    expect(isEmptyish(/abc/u)).toBe(false);
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

  test("weak collections", () => {
    expect(isEmptyish(new WeakMap())).toBe(false);
    expect(isEmptyish(new WeakSet())).toBe(false);
  });

  test("errors", () => {
    // eslint-disable-next-line unicorn/error-message
    expect(isEmptyish(new Error())).toBe(false);
    expect(isEmptyish(new Error("hello world!"))).toBe(false);
  });

  test("prototype chains", () => {
    expect(isEmptyish(Object.create(null))).toBe(true);
    expect(isEmptyish(Object.create({}))).toBe(false);
  });

  test("objects with non-enumerable props", () => {
    expect(isEmptyish({ [Symbol("hello")]: "world" })).toBe(true);
  });

  test("self-declared contradicting props", () => {
    expect(isEmptyish({ length: 0, size: 5 })).toBe(true);
    expect(isEmptyish({ length: 1, size: 0 })).toBe(false);
  });
});

test("self-declared props are not coerced", () => {
  expect(isEmptyish({ length: "0" })).toBe(false);
  expect(isEmptyish({ size: null })).toBe(false);
});
