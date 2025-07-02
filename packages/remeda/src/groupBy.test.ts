import { describe, expect, test } from "vitest";
import { groupBy } from "./groupBy";
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
