import { pipe } from "./pipe";
import { dropLastWhile } from "./dropLastWhile";
import { constant } from "./constant";

describe("data-first", () => {
  test("empty array", () => {
    const result = dropLastWhile([] as [], constant(true));
    expect(result).toEqual([]);
  });

  test("regular array", () => {
    const result = dropLastWhile([] as Array<number>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = dropLastWhile([] as Array<number | string>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = dropLastWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = dropLastWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = dropLastWhile(
      [1, "a"] as [number, ...Array<boolean>, string],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = dropLastWhile([1, "a", true] as const, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = dropLastWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], dropLastWhile(constant(true)));
    expect(result).toEqual([]);
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, dropLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as Array<number | string>,
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, dropLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
