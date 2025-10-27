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
      [] as ReadonlyArray<["a", 1] | ["b", 2] | ["c", 3]>,
    );

    expectTypeOf(result).branded.toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ["a", 1],
      ...ReadonlyArray<["b", 2] | ["c", 3]>,
    ]);

    expectTypeOf(result).branded.toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ...ReadonlyArray<["b", 2] | ["c", 3]>,
      ["a", 1],
    ]);

    expectTypeOf(result).branded.toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as ReadonlyArray<readonly [string, boolean]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as ReadonlyArray<
      readonly ["a", 1] | readonly [`testing_${string}`, boolean]
    >);

    expectTypeOf(result).branded.toEqualTypeOf<
      { a?: 1 } & Record<`testing_${string}`, boolean>
    >();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as ReadonlyArray<
      readonly ["a" | "b" | "c", "d"]
    >);

    expectTypeOf(result).branded.toEqualTypeOf<{ a?: "d"; b?: "d"; c?: "d" }>();
  });

  test("backwards compatibility (number)", () => {
    const result = fromEntries([[1, 123]] as ReadonlyArray<
      readonly [number, 123]
    >);

    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  test("backwards compatibility (string)", () => {
    const result = fromEntries([["a", 123]] as ReadonlyArray<
      readonly [string, 123]
    >);

    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `${string}foo` (issue #1179)", () => {
    const result = fromEntries(
      [] as ReadonlyArray<readonly [`${string}foo`, string]>,
    );

    expectTypeOf(result).toEqualTypeOf<Record<`${string}foo`, string>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `prefix_${number}`", () => {
    const result = fromEntries(
      [] as ReadonlyArray<readonly [`prefix_${number}`, boolean]>,
    );

    expectTypeOf(result).toEqualTypeOf<Record<`prefix_${number}`, boolean>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `${string}_${number}`", () => {
    const result = fromEntries(
      [] as ReadonlyArray<readonly [`${string}_${number}`, number]>,
    );

    expectTypeOf(result).toEqualTypeOf<Record<`${string}_${number}`, number>>();
  });

  test("bounded template literal (pure literal)", () => {
    const result = fromEntries([] as ReadonlyArray<readonly [`foo`, string]>);

    expectTypeOf(result).toEqualTypeOf<{ foo?: string }>();
  });

  test("union key in required tuple position", () => {
    const result = fromEntries([["a", 1]] as readonly [
      readonly ["a" | "b", 1],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 1 }>();
  });

  test("value is a union type", () => {
    const result = fromEntries([["a", 1]] as readonly [readonly ["a", 1 | 2]]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1 | 2 }>();
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
    const result = fromEntries([] as Array<["a", 1] | ["b", 2] | ["c", 3]>);

    expectTypeOf(result).branded.toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as [
      ["a", 1],
      ...Array<["b", 2] | ["c", 3]>,
    ]);

    expectTypeOf(result).branded.toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as [
      ...Array<["b", 2] | ["c", 3]>,
      ["a", 1],
    ]);

    expectTypeOf(result).branded.toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as Array<[string, boolean]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as Array<
      ["a", 1] | [`testing_${string}`, boolean]
    >);

    expectTypeOf(result).branded.toEqualTypeOf<
      { a?: 1 } & Record<`testing_${string}`, boolean>
    >();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as Array<
      readonly ["a" | "b" | "c", "d"]
    >);

    expectTypeOf(result).branded.toEqualTypeOf<{ a?: "d"; b?: "d"; c?: "d" }>();
  });

  test("backwards compatibility (number)", () => {
    const result = fromEntries([[1, 123]] as Array<[number, 123]>);

    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  test("backwards compatibility (string)", () => {
    const result = fromEntries([["a", 123]] as Array<[string, 123]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `${string}foo` (issue #1179)", () => {
    const result = fromEntries([] as Array<[`${string}foo`, string]>);

    expectTypeOf(result).toEqualTypeOf<Record<`${string}foo`, string>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `prefix_${number}`", () => {
    const result = fromEntries([] as Array<[`prefix_${number}`, boolean]>);

    expectTypeOf(result).toEqualTypeOf<Record<`prefix_${number}`, boolean>>();
  });

  // eslint-disable-next-line no-template-curly-in-string
  test("unbounded template literal: `${string}_${number}`", () => {
    const result = fromEntries([] as Array<[`${string}_${number}`, number]>);

    expectTypeOf(result).toEqualTypeOf<Record<`${string}_${number}`, number>>();
  });

  test("bounded template literal (pure literal)", () => {
    const result = fromEntries([] as Array<[`foo`, string]>);

    expectTypeOf(result).toEqualTypeOf<{ foo?: string }>();
  });

  test("union key in required tuple position", () => {
    const result = fromEntries([["a", 1]] as [["a" | "b", 1]]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 1 }>();
  });

  test("value is a union type", () => {
    const result = fromEntries([["a", 1]] as [["a", 1 | 2]]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1 | 2 }>();
  });
});
