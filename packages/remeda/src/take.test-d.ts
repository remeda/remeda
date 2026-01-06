import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data-first", () => {
  test("empty array", () => {
    const result = take([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = take([] as number[], 2);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = take([] as (number | string)[], 2);

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = take([1] as [number, ...boolean[]], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = take([1] as [...boolean[], number], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = take([1, "a"] as [number, ...boolean[], string], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = take([1, "a", true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = take([] as boolean[] | string[], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], take(2));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = pipe([] as number[], take(2));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as (number | string)[], take(2));

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...boolean[]], take(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...boolean[], number], take(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe([1, "a"] as [number, ...boolean[], string], take(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, take(2));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = pipe([] as boolean[] | string[], take(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});
