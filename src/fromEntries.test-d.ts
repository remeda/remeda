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

    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ["a", 1],
      ...ReadonlyArray<["b", 2] | ["c", 3]>,
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as readonly [
      ...ReadonlyArray<["b", 2] | ["c", 3]>,
      ["a", 1],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as ReadonlyArray<readonly [string, boolean]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as ReadonlyArray<
      readonly ["a", 1] | readonly [`testing_${string}`, boolean]
    >);

    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as ReadonlyArray<
      readonly ["a" | "b" | "c", "d"]
    >);

    expectTypeOf(result).toEqualTypeOf<Partial<Record<"a" | "b" | "c", "d">>>();
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

    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (first)", () => {
    const result = fromEntries([["a", 1]] as [
      ["a", 1],
      ...Array<["b", 2] | ["c", 3]>,
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("mixed tuple with rest (last)", () => {
    const result = fromEntries([["a", 1]] as [
      ...Array<["b", 2] | ["c", 3]>,
      ["a", 1],
    ]);

    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
  });

  test("empty generic type", () => {
    const result = fromEntries([] as Array<[string, boolean]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
  });

  test("mixed literals and generics", () => {
    const result = fromEntries([["a", 1]] as Array<
      ["a", 1] | [`testing_${string}`, boolean]
    >);

    expectTypeOf(result).toEqualTypeOf<{
      [x: `testing_${string}`]: boolean | undefined;
      a?: 1;
    }>();
  });

  test("array with literal keys", () => {
    const result = fromEntries([["a", "d"]] as Array<
      readonly ["a" | "b" | "c", "d"]
    >);

    expectTypeOf(result).toEqualTypeOf<Partial<Record<"a" | "b" | "c", "d">>>();
  });

  test("backwards compatibility (number)", () => {
    const result = fromEntries([[1, 123]] as Array<[number, 123]>);

    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
  });

  test("backwards compatibility (string)", () => {
    const result = fromEntries([["a", 123]] as Array<[string, 123]>);

    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
  });
});
