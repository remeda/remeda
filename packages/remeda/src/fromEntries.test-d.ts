import { describe, expectTypeOf, test } from "vitest";
import { fromEntries } from "./fromEntries";

describe("readonly inputs", () => {
  test("trivial empty case", () => {
    const result = fromEntries([] as const);

    expectTypeOf(result).toEqualTypeOf({} as const);
  });

  test("trivial single entry const case", () => {
    const result = fromEntries([["a", 1]] as const);

    expectTypeOf(result).toEqualTypeOf<{ a: 1 }>();
  });

  test("trivial multi entry const case", () => {
    const result = fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ] as const);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 2; c: 3 }>();
  });

  test("empty well defined array", () => {
    const result = fromEntries(
      [] as readonly (["a", 1] | ["b", 2] | ["c", 3])[],
    );

    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ["a", 1],
      ...(readonly (["b", 2] | ["c", 3])[]),
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ...(readonly (["b", 2] | ["c", 3])[]),
      ["a", 1],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as readonly (readonly [string, boolean])[]);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as readonly (
      | readonly ["a", 1]
      | readonly [`testing_${string}`, boolean]
    )[]);

    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as readonly (readonly [
      "a" | "b" | "c",
      "d",
    ])[]);

    expectTypeOf(result).toEqualTypeOf<Partial<Record<"a" | "b" | "c", "d">>>();
  });

  test("backwards compatibility (number)", () => {
    const result = fromEntries([[1, 123]] as readonly (readonly [
      number,
      123,
    ])[]);

    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  test("backwards compatibility (string)", () => {
    const result = fromEntries([["a", 123]] as readonly (readonly [
      string,
      123,
    ])[]);

    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });
});

describe("non-readonly inputs", () => {
  test("trivial empty case", () => {
    const result = fromEntries([]);

    expectTypeOf(result).toEqualTypeOf({} as const);
  });

  test("trivial single entry const case", () => {
    const result = fromEntries([["a", 1]]);

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });

  test("trivial multi entry const case", () => {
    const result = fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });

  test("empty well defined array", () => {
    const result = fromEntries([] as (["a", 1] | ["b", 2] | ["c", 3])[]);

    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as [
      ["a", 1],
      ...(["b", 2] | ["c", 3])[],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as [
      ...(["b", 2] | ["c", 3])[],
      ["a", 1],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as [string, boolean][]);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as (
      | ["a", 1]
      | [`testing_${string}`, boolean]
    )[]);

    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as (readonly [
      "a" | "b" | "c",
      "d",
    ])[]);

    expectTypeOf(result).toEqualTypeOf<Partial<Record<"a" | "b" | "c", "d">>>();
  });

  test("backwards compatibility (number)", () => {
    const result = fromEntries([[1, 123]] as [number, 123][]);

    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  test("backwards compatibility (string)", () => {
    const result = fromEntries([["a", 123]] as [string, 123][]);

    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });
});
