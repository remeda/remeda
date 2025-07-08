import { describe, test } from "vitest";
import { pipe } from "./pipe";
import { setPath } from "./setPath";

declare const TEST_OBJECT: {
  a: {
    b: { c: number; d?: number };
    e: Array<{ f: { g: number } }>;
    z?: number | undefined;
  };
  x?: number;
  y?: number;
};

describe("data first", () => {
  test("should correctly type value argument", () => {
    // @ts-expect-error [ts2345] - this path should yield a type of number
    setPath(TEST_OBJECT, ["a", "e", 1, "f", "g"], "hello");

    // Like this:
    setPath(TEST_OBJECT, ["a", "e", 1, "f", "g"], 123);
  });

  test("should correctly type path argument", () => {
    // @ts-expect-error [ts2322] - 'hello' isn't a valid path
    setPath(TEST_OBJECT, ["a", "hello"], "hello");

    // Like this:
    setPath(TEST_OBJECT, ["a", "z"], 123);
  });

  test("should correctly type partial paths (objects)", () => {
    // @ts-expect-error [ts2345] - this path should yield a type of { c: number }
    setPath(TEST_OBJECT, ["a", "b"] as const, 123);

    // Like this:
    setPath(TEST_OBJECT, ["a", "b"] as const, { c: 123 });
  });

  test("should correctly type partial paths (arrays)", () => {
    const DATA = [[]] as Array<Array<{ c: number }>>;

    // @ts-expect-error [ts2345] - this path should yield a type of { c: number }
    setPath(DATA, [1, 2] as const, 123);

    // Like this:
    setPath(DATA, [1, 2] as const, { c: 123 });
  });

  test("should correctly type an empty path", () => {
    // @ts-expect-error [ts2345] - this path should yield a type of
    // typeof TEST_OBJECT
    setPath(TEST_OBJECT, [] as const, 123);

    // Like this:
    setPath(TEST_OBJECT, [] as const, { a: { b: { c: 123 }, e: [] } });
  });
});

describe("data last", () => {
  test("should correctly type value argument", () => {
    // @ts-expect-error [ts2345] - this path should yield a type of number
    pipe(TEST_OBJECT, setPath(["a", "e", 1, "f", "g"], "hello"));

    // Like this:
    pipe(TEST_OBJECT, setPath(["a", "e", 1, "f", "g"], 123));
  });

  test("should correctly type path argument", () => {
    // @ts-expect-error - 'hello' isn't a valid path
    pipe(TEST_OBJECT, setPath(["a", "hello"], "hello"));

    // Like this:
    pipe(TEST_OBJECT, setPath(["a", "z"], 123));
  });

  test("should correctly type partial paths", () => {
    // @ts-expect-error - this path should yield a type of { c: number }
    pipe(TEST_OBJECT, setPath(["a", "b"] as const, 123));

    // Like this:
    pipe(TEST_OBJECT, setPath(["a", "b"] as const, { c: 123 }));
  });
});

// @see https://github.com/remeda/remeda/issues/990
test("support interfaces (issue #990)", () => {
  interface User {
    name: { first: string };
  }

  setPath({ name: { first: "John" } } as User, ["name", "first"], "Jane");
});
