import { describe, expectTypeOf, test } from "vitest";
import { median } from "./median";
import { pipe } from "./pipe";

test("empty arrays", () => {
  const result = median([] as const);

  expectTypeOf(result).toEqualTypeOf<undefined>();
});

describe("dataFirst", () => {
  test("arbitrary arrays", () => {
    const result = median([] as Array<number>);

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly arrays", () => {
    const result = median([] as ReadonlyArray<number>);

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = median([1, 2] as [number, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = median([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = median([1, 2] as [number, number]);

    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, median());

    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary number arrays", () => {
    const result = pipe([] as Array<number>, median());

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly number arrays", () => {
    const result = pipe([] as ReadonlyArray<number>, median());

    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });
});
