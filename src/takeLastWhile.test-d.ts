import { constant } from "./constant";
import { pipe } from "./pipe";
import { takeLastWhile } from "./takeLastWhile";

describe("data-first", () => {
  test("empty array", () => {
    const result = takeLastWhile([] as [], constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = takeLastWhile([] as Array<number>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = takeLastWhile([] as Array<number | string>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = takeLastWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = takeLastWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = takeLastWhile(
      [1, "a"] as [number, ...Array<boolean>, string],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = takeLastWhile([1, "a", true] as const, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = takeLastWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], takeLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, takeLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as Array<number | string>,
      takeLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      takeLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      takeLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      takeLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, takeLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      takeLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
