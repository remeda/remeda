import { describe, expectTypeOf, test } from "vitest";
import { dropLast } from "./dropLast";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("empty array", () => {
    const result = dropLast([] as [], 2);

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = dropLast([] as number[], 2);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = dropLast([] as (number | string)[], 2);

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = dropLast([1] as [number, ...boolean[]], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = dropLast([1] as [...boolean[], number], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = dropLast([1, "a"] as [number, ...boolean[], string], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = dropLast([1, "a", true] as const, 2);

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = dropLast([] as boolean[] | string[], 2);

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = pipe([] as number[], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = pipe([] as (number | string)[], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = pipe([1] as [number, ...boolean[]], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = pipe([1] as [...boolean[], number], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...boolean[], string],
      dropLast(2),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, dropLast(2));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = pipe([] as boolean[] | string[], dropLast(2));

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});
