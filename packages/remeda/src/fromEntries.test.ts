import { describe, expect, test } from "vitest";
import { fromEntries } from "./fromEntries";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

test("dataLast", () => {
  expect(
    pipe(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ] as const,
      fromEntries(),
    ),
  ).toStrictEqual({ a: 1, b: 2, c: 3 });
});

test("empty array", () => {
  expect(fromEntries([])).toStrictEqual({});
});

test("single entry", () => {
  expect(fromEntries([["a", 1]])).toStrictEqual({ a: 1 });
});

test("boolean values", () => {
  expect(
    fromEntries([
      ["hello", true],
      ["world", false],
    ]),
  ).toStrictEqual({ hello: true, world: false });
});

test("string values", () => {
  expect(fromEntries([["a", "d"]])).toStrictEqual({ a: "d" });
});

test("number keys and values", () => {
  expect(fromEntries([[1, 123]])).toStrictEqual({ 1: 123 });
});

test("values are stored by reference", () => {
  const value = { a: 1 };

  expect(fromEntries([["a", value]] as const).a).toBe(value);
});

test("prototype is Object.prototype", () => {
  expect(Object.getPrototypeOf(fromEntries([["a", 1]]))).toBe(Object.prototype);
});

test("`__proto__` key is an own property", () => {
  expect(Object.entries(fromEntries([["__proto__", 1]]))).toStrictEqual([
    ["__proto__", 1],
  ]);
});

test("`__proto__` key keeps the prototype", () => {
  expect(Object.getPrototypeOf(fromEntries([["__proto__", { a: 1 }]]))).toBe(
    Object.prototype,
  );
});

test("duplicate keys keep the first position and the last value", () => {
  expect(
    Object.entries(
      fromEntries([
        ["a", 1],
        ["b", 2],
        ["a", 3],
      ]),
    ),
  ).toStrictEqual([
    ["a", 3],
    ["b", 2],
  ]);
});

test("number and string keys for the same property collapse", () => {
  expect(
    fromEntries([
      [1, "number"],
      ["1", "string"],
    ]),
  ).toStrictEqual({ 1: "string" });
});

test("symbol keys", () => {
  const mySymbol = Symbol("mySymbol");

  expect(fromEntries([[mySymbol, 1]])).toStrictEqual({ [mySymbol]: 1 });
});

test("key order", () => {
  const mySymbol = Symbol("mySymbol");

  expect(
    Reflect.ownKeys(
      fromEntries([
        ["b", 1],
        ["10", 2],
        [mySymbol, 3],
        ["a", 4],
        ["2", 5],
        ["b", 6],
      ]),
    ),
  ).toStrictEqual(["2", "10", "b", "a", mySymbol]);
});

test("reads the key at index 0 and then the value at index 1", () => {
  const accessed: PropertyKey[] = [];
  const entry = new Proxy(["a", 1] as const, {
    get: (target, property, receiver): unknown => {
      accessed.push(property);
      return Reflect.get(target, property, receiver);
    },
  });

  fromEntries([entry]);

  expect(accessed).toStrictEqual(["0", "1"]);
});

test("a hole throws", () => {
  expect(() =>
    fromEntries(
      // @ts-expect-error [ts2322] -- The hole is the input under test.
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      [["a", 1], , ["b", 2]],
    ),
  ).toThrow(TypeError);
});

test("empty array in a pipe", () => {
  expect(pipe([], fromEntries())).toStrictEqual({});
});

test("prototype is Object.prototype in a pipe", () => {
  expect(Object.getPrototypeOf(pipe([["a", 1]] as const, fromEntries()))).toBe(
    Object.prototype,
  );
});

test("a hole throws in a pipe", () => {
  expect(() =>
    pipe(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      [["a", 1], , ["b", 2]],
      // @ts-expect-error [ts2345] -- The hole is the input under test.
      fromEntries(),
    ),
  ).toThrow(TypeError);
});

describe("known issues!", () => {
  test("a non-object entry becomes an `undefined` key instead of throwing", () => {
    // Indexing a primitive reads `undefined` instead of throwing, and there is
    // no check that each entry is an object like `Object.fromEntries` has.
    // @ts-expect-error [ts2322] -- The invalid entry is the input under test.
    expect(() => fromEntries([1])).not.toThrow(TypeError);

    // Actual
    // @ts-expect-error [ts2322] -- The invalid entry is the input under test.
    expect(fromEntries([1])).toStrictEqual({ undefined });
  });

  test("a non-object entry becomes an `undefined` key instead of throwing in a pipe", () => {
    // Indexing a primitive reads `undefined` instead of throwing, and there is
    // no check that each entry is an object like `Object.fromEntries` has.
    // @ts-expect-error [ts2345] -- The invalid entry is the input under test.
    expect(() => pipe([1], fromEntries())).not.toThrow(TypeError);

    // Actual
    // @ts-expect-error [ts2345] -- The invalid entry is the input under test.
    expect(pipe([1], fromEntries())).toStrictEqual({ undefined });
  });

  test("a string entry is read by character instead of throwing", () => {
    // Strings are indexable, and there is no check that each entry is an
    // object like `Object.fromEntries` has.
    // @ts-expect-error [ts2322] -- The invalid entry is the input under test.
    expect(() => fromEntries(["ab"])).not.toThrow(TypeError);

    // Actual
    // @ts-expect-error [ts2322] -- The invalid entry is the input under test.
    expect(fromEntries(["ab"])).toStrictEqual({ a: "b" });
  });

  test("a string entry is read by character instead of throwing in a pipe", () => {
    // Strings are indexable, and there is no check that each entry is an
    // object like `Object.fromEntries` has.
    // @ts-expect-error [ts2345] -- The invalid entry is the input under test.
    expect(() => pipe(["ab"], fromEntries())).not.toThrow(TypeError);

    // Actual
    // @ts-expect-error [ts2345] -- The invalid entry is the input under test.
    expect(pipe(["ab"], fromEntries())).toStrictEqual({ a: "b" });
  });

  test("a key inherited as read-only (e.g., from a frozen `Object.prototype`) throws instead of becoming an own property", () => {
    // Assignment can't shadow an inherited read-only property, while
    // `Object.fromEntries` defines each property directly. Sloppy-mode code
    // (the CJS build) drops the key silently instead of throwing.
    // Freezing the real `Object.prototype` would leak into every later test;
    // one read-only member is the same lookup, and is removed afterwards.
    // eslint-disable-next-line no-extend-native -- The inherited member is the input under test; the `finally` below removes it.
    Object.defineProperty(Object.prototype, "readOnlyMember", {
      value: "inherited",
      configurable: true,
    });

    try {
      expect(() => fromEntries([["readOnlyMember", 1]])).toThrow(TypeError);
    } finally {
      Reflect.deleteProperty(Object.prototype, "readOnlyMember");
    }
  });
});
