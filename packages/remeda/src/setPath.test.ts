import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { setPath } from "./setPath";
import { stringToPath } from "./stringToPath";

type TestType = {
  a: {
    b: { c: number; d?: number };
    e: { f: { g: number } }[];
    z?: number | undefined;
  };
  x?: number;
  y?: number;
};

const TEST_OBJECT: TestType = {
  a: { b: { c: 1 }, e: [{ f: { g: 1 } }, { f: { g: 1 } }] },
  y: 10,
};

describe("data first", () => {
  test("should set a deeply nested value", () => {
    expect(setPath(TEST_OBJECT, ["a", "b", "c"], 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  test("should work nested arrays", () => {
    expect(setPath(TEST_OBJECT, ["a", "e", 1, "f", "g"], 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, e: [{ f: { g: 1 } }, { f: { g: 2 } }] },
    });
  });

  test("should work with undefined / optional types", () => {
    expect(setPath(TEST_OBJECT, ["a", "z"], undefined)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, z: undefined },
    });
  });

  test("should support partial paths", () => {
    expect(setPath(TEST_OBJECT, ["a", "b"], { c: 2 })).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  test("should combo well with stringToPath", () => {
    expect(setPath(TEST_OBJECT, stringToPath("a.b.c"), 2)).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  test("should build missing segments instead of throwing (issue #554)", () => {
    expect(
      setPath({} as Record<string, { b: number }>, ["a", "b"], 123),
    ).toStrictEqual({ a: { b: 123 } });
  });

  test("should build deeply nested missing segments", () => {
    expect(
      setPath(
        {} as Record<string, Record<string, { c: number }>>,
        ["a", "b", "c"],
        123,
      ),
    ).toStrictEqual({ a: { b: { c: 123 } } });
  });
});

describe("data last", () => {
  test("should set a deeply nested value", () => {
    expect(pipe(TEST_OBJECT, setPath(["a", "b", "c"], 2))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });

  test("should work nested arrays", () => {
    expect(
      pipe(TEST_OBJECT, setPath(["a", "e", 1, "f", "g"], 2)),
    ).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, e: [{ f: { g: 1 } }, { f: { g: 2 } }] },
    });
  });

  test("should work with undefined / optional types", () => {
    expect(pipe(TEST_OBJECT, setPath(["a", "z"], undefined))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, z: undefined },
    });
  });

  test("should support partial paths", () => {
    expect(pipe(TEST_OBJECT, setPath(["a", "b"], { c: 2 }))).toStrictEqual({
      ...TEST_OBJECT,
      a: { ...TEST_OBJECT.a, b: { c: 2 } },
    });
  });
});
