import { describe, expect, test } from "vitest";
import { countBy } from "./countBy";
import { identity } from "./identity";
import { isString } from "./isString";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { toLowerCase } from "./toLowerCase";
import { when } from "./when";
import { isStrictEqual } from "./isStrictEqual";
import { constant } from "./constant";

describe("dataFirst", () => {
  test("countBy", () => {
    expect(countBy([1, 2, 3, 2, 1, 5], identity())).toStrictEqual({
      1: 2,
      2: 2,
      3: 1,
      5: 1,
    });
  });

  test("array of strings", () => {
    expect(
      countBy(["a", "b", "c", "B", "A", "a"], toLowerCase()),
    ).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  test("array of objects", () => {
    expect(
      countBy(
        [
          { id: 1, category: "A" },
          { id: 2, category: "B" },
          { id: 3, category: "A" },
        ],
        prop("category"),
      ),
    ).toStrictEqual({ A: 2, B: 1 });
  });

  test("symbols", () => {
    const mySymbolA = Symbol("mySymbolA");
    const mySymbolB = Symbol("mySymbolB");

    expect(
      countBy([mySymbolA, mySymbolB, mySymbolA], identity()),
    ).toStrictEqual({
      [mySymbolA]: 2,
      [mySymbolB]: 1,
    });
  });

  test("mixed data types", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      countBy(
        [1, "a", 1, mySymbol, "A", mySymbol],
        when(isString, toLowerCase()),
      ),
    ).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  test("indexed", () => {
    expect(
      countBy([1, 2, 3, 2, 1], (_, index) =>
        index % 2 === 0 ? "even" : "odd",
      ),
    ).toStrictEqual({ even: 3, odd: 2 });
  });
});

describe("dataLast", () => {
  test("countBy", () => {
    expect(pipe([1, 2, 3, 2, 1, 5], countBy(identity()))).toStrictEqual({
      1: 2,
      2: 2,
      3: 1,
      5: 1,
    });
  });

  test("array of strings", () => {
    expect(
      pipe(["a", "b", "c", "B", "A", "a"], countBy(toLowerCase())),
    ).toStrictEqual({ a: 3, b: 2, c: 1 });
  });

  test("array of objects", () => {
    expect(
      pipe(
        [
          { id: 1, category: "A" },
          { id: 2, category: "B" },
          { id: 3, category: "A" },
        ],
        countBy(prop("category")),
      ),
    ).toStrictEqual({ A: 2, B: 1 });
  });

  test("symbols", () => {
    const mySymbolA = Symbol("mySymbolA");
    const mySymbolB = Symbol("mySymbolB");

    expect(
      pipe([mySymbolA, mySymbolB, mySymbolA], countBy(identity())),
    ).toStrictEqual({ [mySymbolA]: 2, [mySymbolB]: 1 });
  });

  test("mixed data types", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      pipe(
        [1, "a", 1, mySymbol, "A", mySymbol],
        countBy(when(isString, toLowerCase())),
      ),
    ).toStrictEqual({ 1: 2, a: 2, [mySymbol]: 2 });
  });

  test("indexed", () => {
    expect(
      pipe(
        [1, 2, 3, 2, 1],
        countBy((_, index) => (index % 2 === 0 ? "even" : "odd")),
      ),
    ).toStrictEqual({ even: 3, odd: 2 });
  });
});

test("empty array", () => {
  expect(countBy([], identity())).toStrictEqual({});
});

// https://github.com/remeda/remeda/pull/1049
test("category is an object instance method name", () => {
  expect(
    countBy(
      [
        { a: "toString", b: "toString" },
        { a: "toString", b: "valueOf" },
        { a: "valueOf", b: "toString" },
        { a: "toString", b: "__proto__" },
      ],
      prop("a"),
    ),
  ).toStrictEqual({ toString: 3, valueOf: 1 });
});

test("skip items", () => {
  expect(
    countBy([1, 2, 3, 4, 5], when(isStrictEqual(3), constant(undefined))),
  ).toStrictEqual({ 1: 1, 2: 1, 4: 1, 5: 1 });
});
