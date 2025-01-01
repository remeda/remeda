import { drop } from "./drop";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("empty array", () => {
    const result = drop([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("regular array", () => {
    const result = drop([] as Array<number>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = drop([] as Array<number | string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefixed array", () => {
    const result = drop([1] as [number, ...Array<boolean>], 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
  });

  test("suffixed array", () => {
    const result = drop([1] as [...Array<boolean>, number], 2);

    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean>, number] | [] | [number]
    >();
  });

  describe("arrays with a prefix (2) and a suffix (2)", () => {
    test("n === 0 (no drop)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        0,
      );

      expectTypeOf(result).toEqualTypeOf<
        [number, number, ...Array<boolean>, string, string]
      >();
    });

    test("n === 1 (drop from the prefix)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        1,
      );

      expectTypeOf(result).toEqualTypeOf<
        [number, ...Array<boolean>, string, string]
      >();
    });

    test("n === 2 (remove the prefix)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        2,
      );

      expectTypeOf(result).toEqualTypeOf<[...Array<boolean>, string, string]>();
    });

    test("n === 3 (drop the whole prefix, remove from the suffix)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        3,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [string, string] | [string]
      >();
    });

    test("n === 4 (drop the whole prefix, drop the whole suffix)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        4,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [] | [string, string] | [string]
      >();
    });

    test("n > 4 (drop more than the constant parts of the array)", () => {
      const result = drop(
        [1, 2, "a", "b"] as [number, number, ...Array<boolean>, string, string],
        5,
      );

      expectTypeOf(result).toEqualTypeOf<
        [...Array<boolean>, string, string] | [] | [string, string] | [string]
      >();
    });
  });

  test("tuple", () => {
    const result = drop([1, "a", true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<[true]>();
  });

  test("union of arrays", () => {
    const result = drop([] as Array<boolean> | Array<string>, 2);

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  test("negative count", () => {
    const result = drop([] as Array<number>, -1);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("generalized typed count", () => {
    const result = drop(["a", 1, true] as const, 1 as number);

    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], drop(2));

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as Array<number | string>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...Array<boolean>], drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...Array<boolean>, number], drop(2));

    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean>, number] | [] | [number]
    >();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      drop(2),
    );

    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean>, string] | [] | [string]
    >();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, drop(2));

    expectTypeOf(result).toEqualTypeOf<[true]>();
  });

  test("union of arrays", () => {
    const result = pipe([] as Array<boolean> | Array<string>, drop(2));

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  test("negative count", () => {
    const result = pipe([] as Array<number>, drop(-1));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("generalized typed count", () => {
    const result = pipe([] as Array<number>, drop(1 as number));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});
