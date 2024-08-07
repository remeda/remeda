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

  test("prefix array", () => {
    const result = drop([1] as [number, ...Array<boolean>], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
  });

  test("suffix array", () => {
    const result = drop([1] as [...Array<boolean>, number], 2);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean>, number] | [] | [number]
    >();
  });

  test("array with suffix and prefix", () => {
    const result = drop([1, "a"] as [number, ...Array<boolean>, string], 2);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean>, string] | [] | [string]
    >();
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
    const result = drop([1] as Array<number>, -1);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("generalized typed count", () => {
    const result = drop([1] as Array<number>, 1 as number);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
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
