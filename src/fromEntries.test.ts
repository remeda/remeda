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

  test("trivial empty case", () => {
    expect(fromEntries([])).toStrictEqual({});
  });

  test("trivial single entry const case", () => {
    expect(fromEntries([["a", 1]])).toStrictEqual({ a: 1 });
  });

  test("trivial multi entry const case", () => {
    expect(
      fromEntries([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ] as const),
    ).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test("single value generic type", () => {
    expect(fromEntries([["hello", true]])).toStrictEqual({ hello: true });
  });

  test("multi-value generic type", () => {
    expect(
      fromEntries([
        ["hello", true],
        ["world", false],
      ]),
    ).toStrictEqual({ hello: true, world: false });
  });

  test("array with literal keys", () => {
    expect(fromEntries([["a", "d"]])).toStrictEqual({ a: "d" });
  });

  test("backwards compatibility (number)", () => {
    expect(fromEntries([[1, 123]])).toStrictEqual({ 1: 123 });
  });

  test("backwards compatibility (string)", () => {
    expect(fromEntries([["a", 123]])).toStrictEqual({ a: 123 });
  });

  test("single value generic type", () => {
    expect(fromEntries([["hello", true]])).toStrictEqual({ hello: true });
  });

  test("multi-value generic type", () => {
    expect(
      fromEntries([
        ["hello", true],
        ["world", false],
      ]),
    ).toStrictEqual({ hello: true, world: false });
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
      const arr: ReadonlyArray<["a", 1] | ["b", 2] | ["c", 3]> = [];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("single value well defined array", () => {
      const arr: ReadonlyArray<["a", 1] | ["b", 2] | ["c", 3]> = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("multi-value well defined array", () => {
      const arr: ReadonlyArray<["a", 1] | ["b", 2] | ["c", 3]> = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (first)", () => {
      const arr: readonly [["a", 1], ...ReadonlyArray<["b", 2] | ["c", 3]>] = [
        ["a", 1],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (last)", () => {
      const arr: readonly [...ReadonlyArray<["b", 2] | ["c", 3]>, ["a", 1]] = [
        ["a", 1],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("empty generic type", () => {
      const arr: ReadonlyArray<readonly [string, boolean]> = [];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("single value generic type", () => {
      const arr: ReadonlyArray<readonly [string, boolean]> = [["hello", true]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("multi-value generic type", () => {
      const arr: ReadonlyArray<readonly [string, boolean]> = [
        ["hello", true],
        ["world", false],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("mixed literals and generics", () => {
      const arr: ReadonlyArray<
        readonly ["a", 1] | readonly [`testing_${string}`, boolean]
      > = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<
        Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
      >();
    });

    test("array with literal keys", () => {
      const arr: ReadonlyArray<readonly ["a" | "b" | "c", "d"]> = [["a", "d"]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<
        Partial<Record<"a" | "b" | "c", "d">>
      >();
    });

    test("backwards compatibility (number)", () => {
      const arr: ReadonlyArray<readonly [number, 123]> = [[1, 123]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    });

    test("backwards compatibility (string)", () => {
      const arr: ReadonlyArray<readonly [string, 123]> = [["a", 123]];
      const result = fromEntries(arr);
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
      const arr: Array<["a", 1] | ["b", 2] | ["c", 3]> = [];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("single value well defined array", () => {
      const arr: Array<["a", 1] | ["b", 2] | ["c", 3]> = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("multi-value well defined array", () => {
      const arr: Array<["a", 1] | ["b", 2] | ["c", 3]> = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (first)", () => {
      const arr: [["a", 1], ...Array<["b", 2] | ["c", 3]>] = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("mixed tuple with rest (last)", () => {
      const arr: [...Array<["b", 2] | ["c", 3]>, ["a", 1]] = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    });

    test("empty generic type", () => {
      const arr: Array<[string, boolean]> = [];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("single value generic type", () => {
      const arr: Array<[string, boolean]> = [["hello", true]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("multi-value generic type", () => {
      const arr: Array<[string, boolean]> = [
        ["hello", true],
        ["world", false],
      ];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    });

    test("mixed literals and generics", () => {
      const arr: Array<["a", 1] | [`testing_${string}`, boolean]> = [["a", 1]];
      const result = fromEntries(arr);
      expectTypeOf(result).toMatchTypeOf<
        Partial<Record<`testing_${string}`, boolean>> & { a?: 1 }
      >();
    });

    test("array with literal keys", () => {
      const arr: Array<readonly ["a" | "b" | "c", "d"]> = [["a", "d"]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<
        Partial<Record<"a" | "b" | "c", "d">>
      >();
    });

    test("backwards compatibility (number)", () => {
      const arr: Array<[number, 123]> = [[1, 123]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    });

    test("backwards compatibility (string)", () => {
      const arr: Array<[string, 123]> = [["a", 123]];
      const result = fromEntries(arr);
      expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
    });
  });
});
