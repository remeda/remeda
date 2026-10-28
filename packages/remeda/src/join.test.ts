import { describe, expect, test } from "vitest";
import { constant } from "./constant";
import { join } from "./join";
import { pipe } from "./pipe";

describe("joins same-typed items", () => {
  test("number", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  test("string", () => {
    const array = ["a", "b", "c", "d", "e"];
    const result = join(array, ",");

    expect(result).toBe("a,b,c,d,e");
  });

  test("bigint", () => {
    const array = [1n, 2n, 3n, 4n, 5n];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  test("boolean", () => {
    const array = [true, false, true, false, true];
    const result = join(array, ",");

    expect(result).toBe("true,false,true,false,true");
  });

  test("null", () => {
    const array = [null, null, null, null, null];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });

  test("undefined", () => {
    const array = [undefined, undefined, undefined, undefined, undefined];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });
});

test("joins different-typed items", () => {
  const array = [1, "2", 3n, true, null, undefined];
  const result = join(array, ",");

  expect(result).toBe("1,2,3,true,,");
});

describe("edge-cases", () => {
  test("empty glue", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, "");

    expect(result).toBe("12345");
  });

  test("empty array", () => {
    const array: number[] = [];
    const result = join(array, ",");

    expect(result).toBe("");
  });

  test("doesnt add glue on single item", () => {
    const array = [1];
    const result = join(array, ",");

    expect(result).toBe("1");
  });

  test("holes become empty strings", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
    expect(join([1, , 3], "-")).toBe("1--3");
  });

  test("nested arrays join their own items with commas", () => {
    // @ts-expect-error [ts2322] -- The nested array is the input under test.
    expect(join([1, [2, [3, null]]], "-")).toBe("1-2,3,");
  });

  test("objects convert with the string hint", () => {
    expect(
      // @ts-expect-error [ts2322] -- The object is the input under test.
      join(["a", { toString: constant("b"), valueOf: constant("c") }], "-"),
    ).toBe("a-b");
  });

  test("a self-referencing array joins as empty", () => {
    const array: unknown[] = [1];
    array.push(array);

    // @ts-expect-error [ts2345] -- The array is the input under test.
    expect(join(array, "-")).toBe("1-");
  });

  test("a symbol item throws", () => {
    // @ts-expect-error [ts2322] -- The symbol is the input under test.
    expect(() => join([Symbol("a")], "-")).toThrow(
      new TypeError("Cannot convert a Symbol value to a string"),
    );
  });
});

describe("data last", () => {
  test("joins items", () => {
    expect(pipe([1, 2, 3], join(","))).toBe("1,2,3");
  });

  test("empty array", () => {
    expect(pipe([], join(","))).toBe("");
  });

  test("a symbol item throws", () => {
    // @ts-expect-error [ts2322] -- The symbol is the input under test.
    expect(() => pipe([Symbol("a")], join(","))).toThrow(
      new TypeError("Cannot convert a Symbol value to a string"),
    );
  });
});
