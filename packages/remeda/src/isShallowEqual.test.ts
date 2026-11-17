import { describe, expect, test } from "vitest";
import { isShallowEqual } from "./isShallowEqual";
import { pipe } from "./pipe";

describe("primitives", () => {
  test("undefined", () => {
    expect(isShallowEqual(undefined, undefined)).toBe(true);
  });

  test("null", () => {
    expect(isShallowEqual(null, null)).toBe(true);
  });

  test("string", () => {
    expect(isShallowEqual("a", "a")).toBe(true);
    expect(isShallowEqual("a", "b")).toBe(false);
  });

  test("number", () => {
    expect(isShallowEqual(1, 1)).toBe(true);
    expect(isShallowEqual(1, 2)).toBe(false);
  });

  test("boolean", () => {
    expect(isShallowEqual(true, true)).toBe(true);
    expect(isShallowEqual(true, false)).toBe(false);
  });

  test("bigint", () => {
    expect(isShallowEqual(1n, 1n)).toBe(true);
    expect(isShallowEqual(1n, 2n)).toBe(false);
  });
});

describe("objects", () => {
  test("arrays", () => {
    const data = [1, 2, 3];

    expect(isShallowEqual(data, [1, 2, 3])).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, [1, 2])).toBe(false);
  });

  test("objects", () => {
    const data = { a: 1, b: 2 } as Record<string, number>;

    expect(isShallowEqual(data, { a: 1, b: 2 })).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, { a: 1 })).toBe(false);
    expect(isShallowEqual(data, { a: 1, c: 3 })).toBe(false);
  });

  test("objects with different keys holding undefined", () => {
    expect(isShallowEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  test("uint arrays", () => {
    const data = new Uint8Array([1, 2, 3]);

    expect(isShallowEqual(data, new Uint8Array([1, 2, 3]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Uint8Array([1, 2]))).toBe(false);
  });

  test("maps", () => {
    const data = new Map([["a", 1]]);

    expect(isShallowEqual(data, new Map([["a", 1]]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Map([["a", 2]]))).toBe(false);
    expect(
      isShallowEqual(
        data,
        new Map([
          ["a", 1],
          ["b", 2],
        ]),
      ),
    ).toBe(false);
  });

  test("maps with different keys holding undefined", () => {
    expect(
      isShallowEqual(new Map([["a", undefined]]), new Map([["b", undefined]])),
    ).toBe(false);
  });

  test("maps with the same key holding undefined", () => {
    expect(
      isShallowEqual(new Map([["a", undefined]]), new Map([["a", undefined]])),
    ).toBe(true);
  });

  test("sets", () => {
    const data = new Set([1, 2, 3]);

    expect(isShallowEqual(data, new Set([1, 2, 3]))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Set([1, 2]))).toBe(false);
    expect(isShallowEqual(data, new Set([4, 5, 6]))).toBe(false);
  });
});

describe("built-ins", () => {
  test("regex", () => {
    const data = /a/u;

    expect(isShallowEqual(data, /a/u)).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, /b/u)).toBe(true);
  });

  test("dates", () => {
    const data = new Date();

    expect(isShallowEqual(data, new Date())).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, new Date(data.getTime() + 1))).toBe(true);
  });

  test("promises", () => {
    const data = Promise.resolve(1);

    expect(isShallowEqual(data, Promise.resolve(1))).toBe(true);
    expect(isShallowEqual(data, data)).toBe(true);

    expect(isShallowEqual(data, Promise.resolve(2))).toBe(true);
  });
});

// The contained values are compared with SameValueZero semantics (like
// `Array.prototype.includes` and `isDeepEqual`), matching how the values
// themselves compare at the top level.
describe("sameValueZero", () => {
  test("nan", () => {
    expect(isShallowEqual(NaN, NaN)).toBe(true);
    expect(isShallowEqual({ a: NaN }, { a: NaN })).toBe(true);
    expect(isShallowEqual([NaN], [NaN])).toBe(true);
    expect(isShallowEqual(new Map([["a", NaN]]), new Map([["a", NaN]]))).toBe(
      true,
    );
    expect(isShallowEqual(new Set([NaN]), new Set([NaN]))).toBe(true);
  });

  test("signed zeros", () => {
    expect(isShallowEqual(0, -0)).toBe(true);
    expect(isShallowEqual({ a: 0 }, { a: -0 })).toBe(true);
    expect(isShallowEqual([0], [-0])).toBe(true);
    expect(isShallowEqual(new Map([["a", 0]]), new Map([["a", -0]]))).toBe(
      true,
    );
  });
});

describe("shallow inequality", () => {
  test("arrays of objects", () => {
    const a = { a: 1 };

    expect(isShallowEqual([a], [a])).toBe(true);
    expect(isShallowEqual([a], [{ a: 1 }])).toBe(false);
  });

  test("arrays of arrays", () => {
    const a = [1];

    expect(isShallowEqual([a], [a])).toBe(true);
    expect(isShallowEqual([a], [[1]])).toBe(false);
  });

  test("objects of arrays", () => {
    const a = [1];

    expect(isShallowEqual({ a }, { a })).toBe(true);
    expect(isShallowEqual({ a }, { a: [1] })).toBe(false);
  });

  test("objects of objects", () => {
    const a = { b: 1 };

    expect(isShallowEqual({ a }, { a })).toBe(true);
    expect(isShallowEqual({ a }, { a: { b: 1 } })).toBe(false);
  });
});

describe("data-last", () => {
  test("equal", () => {
    expect(pipe({ a: 1 }, isShallowEqual({ a: 1 }))).toBe(true);
  });

  test("not equal", () => {
    expect(pipe({ a: 1 }, isShallowEqual({ a: 2 }))).toBe(false);
  });
});

describe("known issues!", () => {
  test("a Set equals an empty array typed as the same iterable", () => {
    const isEqual = isShallowEqual(new Set([1]) as Iterable<number>, []);

    // Entries are compared only between two Maps or two Sets; any other pair
    // compares own enumerable keys, and a Map or Set has none.
    expect(isEqual).not.toBe(false);

    // Actual
    expect(isEqual).toBe(true);
  });

  test("a non-enumerable own property stands in for a missing key", () => {
    const isEqual = isShallowEqual({ length: 1 }, ["x"]);

    // Keys are counted with `Object.keys`, which skips non-enumerable
    // properties, but matched with `Object.hasOwn`, which doesn't, so the
    // array's hidden `length` matches while its `0` key is never checked.
    expect(isEqual).not.toBe(false);

    // Actual
    expect(isEqual).toBe(true);
  });
});
