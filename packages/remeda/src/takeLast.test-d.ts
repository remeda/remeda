import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { takeLast } from "./takeLast";

describe("data-first", () => {
  test("empty array", () => {
    const result = takeLast([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = takeLast([] as number[], 2);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = takeLast([] as (number | string)[], 2);

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = takeLast([1] as [number, ...boolean[]], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = takeLast([1] as [...boolean[], number], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = takeLast([1, "a"] as [number, ...boolean[], string], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = takeLast([1, "a", true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = takeLast([] as boolean[] | string[], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = pipe([] as number[], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as (number | string)[], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...boolean[]], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...boolean[], number], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...boolean[], string],
      takeLast(2),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, takeLast(2));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = pipe([] as boolean[] | string[], takeLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});
