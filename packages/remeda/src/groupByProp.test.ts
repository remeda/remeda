import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { groupByProp } from "./groupByProp";
import { pipe } from "./pipe";

const SYMBOL = Symbol("sym");

test("empty array", () => {
  expect(groupByProp([] as { a: string }[], "a")).toStrictEqual({});
});

describe("data first", () => {
  test("must be grouped correctly by string", () => {
    expect(
      groupByProp(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        "a",
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

  test("must be grouped correctly by number", () => {
    expect(
      groupByProp(
        [
          { 1: "cat", 2: 123 },
          { 1: "dog", 2: 456 },
          { 1: "dog", 2: 789 },
          { 1: "cat", 2: 101 },
        ],
        1,
      ),
    ).toStrictEqual({
      cat: [
        { 1: "cat", 2: 123 },
        { 1: "cat", 2: 101 },
      ],
      dog: [
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
      ],
    });
  });

  test("must be grouped correctly by Symbol", () => {
    expect(
      groupByProp(
        [
          { [SYMBOL]: "cat", 2: 123 },
          { [SYMBOL]: "dog", 2: 456 },
          { [SYMBOL]: "dog", 2: 789 },
          { [SYMBOL]: "cat", 2: 101 },
        ],
        SYMBOL,
      ),
    ).toStrictEqual({
      cat: [
        { [SYMBOL]: "cat", 2: 123 },
        { [SYMBOL]: "cat", 2: 101 },
      ],
      dog: [
        { [SYMBOL]: "dog", 2: 456 },
        { [SYMBOL]: "dog", 2: 789 },
      ],
    });
  });

  test("single item", () => {
    expect(groupByProp([{ a: "cat" }], "a")).toStrictEqual({
      cat: [{ a: "cat" }],
    });
  });

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(groupByProp([{ a: "cat" }], "a"))).toBe(
      Object.prototype,
    );
  });

  test("`__proto__` value is an own property", () => {
    expect(
      Object.entries(groupByProp([{ a: "__proto__" }], "a")),
    ).toStrictEqual([["__proto__", [{ a: "__proto__" }]]]);
  });

  test("number values share the group of their string form", () => {
    expect(
      groupByProp([{ a: 1 }, { a: "1" }, { a: 0 }, { a: -0 }], "a"),
    ).toStrictEqual({
      1: [{ a: 1 }, { a: "1" }],
      0: [{ a: 0 }, { a: -0 }],
    });
  });

  test("key order", () => {
    expect(
      Reflect.ownKeys(
        groupByProp(
          [
            { a: "b" },
            { a: "10" },
            { a: SYMBOL },
            { a: "a" },
            { a: "2" },
            { a: "b" },
          ],
          "a",
        ),
      ),
    ).toStrictEqual(["2", "10", "b", "a", SYMBOL]);
  });

  test("falsy values other than undefined", () => {
    expect(groupByProp([{ a: "" }, { a: 0 }, { a: "" }], "a")).toStrictEqual({
      "": [{ a: "" }, { a: "" }],
      0: [{ a: 0 }],
    });
  });

  test("items without the prop are skipped", () => {
    expect(groupByProp([{ a: "cat" }, { b: "dog" }], "a")).toStrictEqual({
      cat: [{ a: "cat" }],
    });
  });

  test("undefined values are skipped", () => {
    expect(groupByProp([{ a: "cat" }, { a: undefined }], "a")).toStrictEqual({
      cat: [{ a: "cat" }],
    });
  });

  test("holes are skipped", () => {
    expect(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      groupByProp([{ a: "cat" }, , { a: "cat" }], "a"),
    ).toStrictEqual({ cat: [{ a: "cat" }, { a: "cat" }] });
  });

  test("reads the prop once per item", () => {
    const getter = vi.fn<() => string>(constant("cat"));

    groupByProp(
      [
        {
          get a() {
            return getter();
          },
        },
        {
          get a() {
            return getter();
          },
        },
      ],
      "a",
    );

    expect(getter).toHaveBeenCalledTimes(2);
  });
});

describe("data last", () => {
  test("must be grouped correctly by string", () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        groupByProp("a"),
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

  test("must be grouped correctly by number", () => {
    expect(
      pipe(
        [
          { 1: "cat", 2: 123 },
          { 1: "dog", 2: 456 },
          { 1: "dog", 2: 789 },
          { 1: "cat", 2: 101 },
        ],
        groupByProp(1),
      ),
    ).toStrictEqual({
      cat: [
        { 1: "cat", 2: 123 },
        { 1: "cat", 2: 101 },
      ],
      dog: [
        { 1: "dog", 2: 456 },
        { 1: "dog", 2: 789 },
      ],
    });
  });

  test("must be grouped correctly by Symbol", () => {
    expect(
      pipe(
        [
          { [SYMBOL]: "cat", 2: 123 },
          { [SYMBOL]: "dog", 2: 456 },
          { [SYMBOL]: "dog", 2: 789 },
          { [SYMBOL]: "cat", 2: 101 },
        ],
        groupByProp(SYMBOL),
      ),
    ).toStrictEqual({
      cat: [
        { [SYMBOL]: "cat", 2: 123 },
        { [SYMBOL]: "cat", 2: 101 },
      ],
      dog: [
        { [SYMBOL]: "dog", 2: 456 },
        { [SYMBOL]: "dog", 2: 789 },
      ],
    });
  });

  test("empty array", () => {
    expect(pipe([] as { a: string }[], groupByProp("a"))).toStrictEqual({});
  });

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(pipe([{ a: "cat" }], groupByProp("a")))).toBe(
      Object.prototype,
    );
  });
});

test("handles undefined as optional elements", () => {
  expect(
    groupByProp(
      // @ts-expect-error [ts2352] -- When `exactOptionalPropertyTypes` isn't enabled in tsconfig.json this isn't an error and would be acceptable as input, so we want to also test this case and make sure we don't cause issues. In our project the settings is enabled so we have to suppress the error.
      [{ a: "cat" }, undefined] as [{ a: string }, { a: string }?],
      "a",
    ),
  ).toStrictEqual({ cat: [{ a: "cat" }] });
});

test("grouping value is a key of object.prototype (issue #1049)", () => {
  expect(
    groupByProp(
      [
        { a: "toString", b: "toString" },
        { a: "toString", b: "valueOf" },
        { a: "valueOf", b: "toString" },
        { a: "toString", b: "__proto__" },
      ],
      "a",
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
