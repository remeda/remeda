import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { groupBy } from "./groupBy";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("data first", () => {
  test("groupBy", () => {
    expect(
      groupBy(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        prop("a"),
      ),
    ).toStrictEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });

  test("empty array", () => {
    expect(groupBy([], constant("a"))).toStrictEqual({});
  });

  test("single item", () => {
    expect(groupBy(["a"], identity())).toStrictEqual({ a: ["a"] });
  });

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(groupBy(["a"], identity()))).toBe(
      Object.prototype,
    );
  });

  test("`__proto__` key is an own property", () => {
    expect(
      Object.entries(groupBy(["a", "b"], constant("__proto__"))),
    ).toStrictEqual([["__proto__", ["a", "b"]]]);
  });

  test("number keys share the group of their string form", () => {
    expect(groupBy([1, "1", 0, -0], identity())).toStrictEqual({
      1: [1, "1"],
      0: [0, -0],
    });
  });

  test("symbol keys", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      groupBy(["a", "b"], (item) => (item === "a" ? mySymbol : item)),
    ).toStrictEqual({ [mySymbol]: ["a"], b: ["b"] });
  });

  test("key order", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      Reflect.ownKeys(
        groupBy(["b", "10", mySymbol, "a", "2", "b"], identity()),
      ),
    ).toStrictEqual(["2", "10", "b", "a", mySymbol]);
  });

  test("falsy keys other than undefined", () => {
    expect(groupBy(["", 0, ""], identity())).toStrictEqual({
      "": ["", ""],
      0: [0],
    });
  });

  test("holes are grouped as undefined", () => {
    expect(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      groupBy([1, , 3], (item) => (item === undefined ? "hole" : "item")),
    ).toStrictEqual({ item: [1, 3], hole: [undefined] });
  });

  test("calls the grouper once per item, in order, with the whole input", () => {
    const data = ["a", "b", "c"];
    const grouper =
      vi.fn<(value: string, index: number, data: readonly string[]) => string>(
        identity(),
      );

    groupBy(data, grouper);

    expect(grouper.mock.calls).toStrictEqual([
      ["a", 0, data],
      ["b", 1, data],
      ["c", 2, data],
    ]);
  });
});

describe("data last", () => {
  test("groupBy", () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        groupBy(prop("a")),
      ),
    ).toStrictEqual({
      1: [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 1 }],
    });
  });

  test("empty array", () => {
    expect(pipe([], groupBy(constant("a")))).toStrictEqual({});
  });

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(pipe(["a"], groupBy(identity())))).toBe(
      Object.prototype,
    );
  });
});

describe("filtering on undefined grouper result", () => {
  // These tests use a contrived example that is basically a simple filter. The
  // goal of these tests is to make sure that all flavours of the function
  // accept an undefined return value for the grouper function, and that it
  // works in all the cases, including the typing.

  test("regular", () => {
    const result = groupBy([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (x) =>
      x % 2 === 0 ? "even" : undefined,
    );

    expect(Object.values(result)).toHaveLength(1);
    expect(result.even).toStrictEqual([0, 2, 4, 6, 8]);
  });

  test("regular indexed", () => {
    const result = groupBy(
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      (_, index) => (index % 2 === 0 ? "even" : undefined),
    );

    expect(Object.values(result)).toHaveLength(1);
    expect(result.even).toStrictEqual(["a", "c", "e", "g", "i"]);
  });
});

// https://github.com/remeda/remeda/pull/1049
describe("key is an object instance method name", () => {
  test("groupBy", () => {
    expect(
      groupBy(
        [
          { a: "toString", b: "toString" },
          { a: "toString", b: "valueOf" },
          { a: "valueOf", b: "toString" },
          { a: "toString", b: "__proto__" },
        ],
        prop("a"),
      ),
    ).toStrictEqual({
      toString: [
        { a: "toString", b: "toString" },
        { a: "toString", b: "valueOf" },
        { a: "toString", b: "__proto__" },
      ],
      valueOf: [{ a: "valueOf", b: "toString" }],
    });
  });
});
