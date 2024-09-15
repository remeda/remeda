import { sumBy } from "./sumBy";
import { expectTypeOf } from "vitest";
import { pipe } from "./pipe";

test("empty array", () => {
  const result = sumBy([], BigInt);
  expectTypeOf(result).toEqualTypeOf<0>();
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = sumBy([] as Array<number>, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sumBy([] as ReadonlyArray<number>, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sumBy([1, 2] as [number, ...Array<number>], toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = sumBy([1, 2, 3] as const, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1, 2] as [number, number], toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("bigints", () => {
  test("arbitrary arrays", () => {
    const result = sumBy([] as Array<unknown>, toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sumBy([] as ReadonlyArray<unknown>, toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sumBy([1n, 2n] as [bigint, ...Array<bigint>], toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = sumBy([1n, 2n, 3n] as const, toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1n, 2n] as [bigint, bigint], toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, sumBy(toNumber));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("bigints", () => {
    const result = pipe([1n, 2n, 3n] as const, sumBy(toBigInt));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

function toNumber(_value: unknown): number {
  return 1;
}

function toBigInt(_value: unknown): bigint {
  return 1n;
}
