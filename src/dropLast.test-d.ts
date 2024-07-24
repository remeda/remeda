import { pipe } from "./pipe";
import { dropLast } from "./dropLast";

describe("data-first", () => {
  test("empty array", () => {
    const result = dropLast([] as [], 2);
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = dropLast([] as Array<number>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = dropLast([] as Array<number | string>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = dropLast([1] as [number, ...Array<boolean>], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = dropLast([1] as [...Array<boolean>, number], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = dropLast([1, "a"] as [number, ...Array<boolean>, string], 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = dropLast([1, "a", true] as const, 2);
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = dropLast([] as Array<boolean> | Array<string>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as Array<number | string>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...Array<boolean>], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...Array<boolean>, number], dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      dropLast(2),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe([] as Array<boolean> | Array<string>, dropLast(2));
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});
