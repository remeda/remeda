import { describe, expectTypeOf, test } from "vitest";
import { join } from "./join";

test("empty tuple", () => {
  const array: [] = [];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<"">();
});

test("empty readonly tuple", () => {
  const array: readonly [] = [];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<"">();
});

test("array", () => {
  const array: Array<number> = [];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<string>();
});

test("readonly array", () => {
  const array: ReadonlyArray<number> = [];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<string>();
});

test("tuple", () => {
  const array: ["a" | "b", "c" | "d", "e" | "f"] = ["a", "c", "e"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${"c" | "d"},${
    | "e"
    | "f"}`>();
});

test("readonly tuple", () => {
  const array: readonly ["a" | "b", "c" | "d", "e" | "f"] = ["a", "c", "e"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${"c" | "d"},${
    | "e"
    | "f"}`>();
});

test("tuple with rest tail", () => {
  const array: ["a" | "b", ...Array<"c" | "d">] = ["a", "c"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${string}`>();
});

test("readonly tuple with rest tail", () => {
  const array: readonly ["a" | "b", ...Array<"c" | "d">] = ["a", "c"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${string}`>();
});

test("tuple with rest head", () => {
  const array: [...Array<"a" | "b">, "c" | "d"] = ["a", "c"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${string},${"c" | "d"}`>();
});

test("readonly tuple with rest head", () => {
  const array: readonly [...Array<"a" | "b">, "c" | "d"] = ["a", "c"];
  const result = join(array, ",");

  expectTypeOf(result).toEqualTypeOf<`${string},${"c" | "d"}`>();
});

describe("tuple item types", () => {
  test("number", () => {
    const array: [number, number] = [1, 2];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${number},${number}`>();
  });

  test("string", () => {
    const array: [string, string] = ["a", "b"];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${string},${string}`>();
  });

  test("bigint", () => {
    const array: [bigint, bigint] = [1n, 2n];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${bigint},${bigint}`>();
  });

  test("boolean", () => {
    const array: [boolean, boolean] = [true, false];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${boolean},${boolean}`>();
  });

  test("null", () => {
    const array: [null, null] = [null, null];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<",">();
  });

  test("undefined", () => {
    const array: [undefined, undefined] = [undefined, undefined];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<",">();
  });

  test("mixed", () => {
    const array: [number, undefined, string] = [1, undefined, "a"];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${number},,${string}`>();
  });

  test("nullish items", () => {
    const array: [
      "prefix" | undefined,
      "midfix" | undefined,
      "suffix" | undefined,
    ] = ["prefix", undefined, "suffix"];
    const result = join(array, ",");

    expectTypeOf(result).toEqualTypeOf<`${"" | "prefix"},${"" | "midfix"},${
      | ""
      | "suffix"}`>();
  });
});
