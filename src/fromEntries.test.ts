import { fromEntries } from "./fromEntries";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      fromEntries([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]),
    ).toEqual({ a: 1, b: 2, c: 3 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        [
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ] as const,
        fromEntries(),
      ),
    ).toEqual({ a: 1, b: 2, c: 3 });
  });

  test("empty array", () => {
    expect(fromEntries([])).toStrictEqual({});
  });

  test("Single entry", () => {
    expect(fromEntries([["a", 1]])).toStrictEqual({ a: 1 });
  });

  test("boolean values", () => {
    expect(
      fromEntries([
        ["hello", true],
        ["world", false],
      ]),
    ).toStrictEqual({ hello: true, world: false });
  });

  test("string values", () => {
    expect(fromEntries([["a", "d"]])).toStrictEqual({ a: "d" });
  });

  test("number keys and values", () => {
    expect(fromEntries([[1, 123]])).toStrictEqual({ 1: 123 });
  });
});

describe("typing", () => {
  describe("readonly inputs", () => {
    test("trivial empty case", () => {
      const result = fromEntries([] as const);
      expectTypeOf(result).toEqualTypeOf({} as const);
    });

    test("trivial single entry const case", () => {
      const result = fromEntries([["a", 1]] as const);
      expectTypeOf(result).toMatchTypeOf<{ a: 1 }>();
    });

    test("trivial multi entry const case", () => {
      const result = fromEntries([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ] as const);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b: 2; c: 3 }>();
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
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (last)", () => {
      const result = fromEntries([["a", 1]] as readonly [
        ...ReadonlyArray<["b", 2] | ["c", 3]>,
        ["a", 1],
      ]);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("empty generic type", () => {
      const result = fromEntries(
        [] as ReadonlyArray<readonly [string, boolean]>,
      );
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("mixed literals and generics", () => {
      const result = fromEntries([["a", 1]] as ReadonlyArray<
        readonly ["a", 1] | readonly [`testing_${string}`, boolean]
      >);
      expectTypeOf(result).toMatchTypeOf<
        Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
      >();
    });

    test("array with literal keys", () => {
      const result = fromEntries([["a", "d"]] as ReadonlyArray<
        readonly ["a" | "b" | "c", "d"]
      >);
      expectTypeOf(result).toEqualTypeOf<
        Partial<Record<"a" | "b" | "c", "d">>
      >();
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
      expectTypeOf(result).toMatchTypeOf<Record<string, number>>();
    });

    test("trivial multi entry const case", () => {
      const result = fromEntries([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      expectTypeOf(result).toMatchTypeOf<Record<string, number>>();
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
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (last)", () => {
      const result = fromEntries([["a", 1]] as [
        ...Array<["b", 2] | ["c", 3]>,
        ["a", 1],
      ]);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("empty generic type", () => {
      const result = fromEntries([] as Array<[string, boolean]>);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("mixed literals and generics", () => {
      const result = fromEntries([["a", 1]] as Array<
        ["a", 1] | [`testing_${string}`, boolean]
      >);
      expectTypeOf(result).toMatchTypeOf<
        Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
      >();
    });

    test("array with literal keys", () => {
      const result = fromEntries([["a", "d"]] as Array<
        readonly ["a" | "b" | "c", "d"]
      >);
      expectTypeOf(result).toEqualTypeOf<
        Partial<Record<"a" | "b" | "c", "d">>
      >();
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
});
