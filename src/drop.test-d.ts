import { pipe } from "./pipe";
import { drop } from "./drop";

describe("data-first", () => {
  test("empty array", () => {
    const result = drop([] as [], 2);
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
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
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = drop([1] as [...Array<boolean>, number], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = drop([1, "a"] as [number, ...Array<boolean>, string], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = drop([1, "a", true] as const, 2);
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = drop([] as Array<boolean> | Array<string>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], drop(2));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
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
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...Array<boolean>, number], drop(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      drop(2),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, drop(2));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe([] as Array<boolean> | Array<string>, drop(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
