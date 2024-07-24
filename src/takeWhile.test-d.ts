import { constant } from "./constant";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";

describe("data-first", () => {
  test("empty array", () => {
    const result = takeWhile([] as [], constant(true));
    expect(result).toEqual([]);
  });

  test("regular array", () => {
    const result = takeWhile([] as Array<number>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = takeWhile([] as Array<number | string>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = takeWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = takeWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = takeWhile(
      [1, "a"] as [number, ...Array<boolean>, string],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = takeWhile([1, "a", true] as const, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = takeWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], takeWhile(constant(true)));
    expect(result).toEqual([]);
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, takeWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as Array<number | string>,
      takeWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      takeWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      takeWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      takeWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, takeWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      takeWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
