import { sumBy } from "./sumBy";
import { expectTypeOf } from "vitest";
import { pipe } from "./pipe";
import { constant } from "./constant";

const toNumber = constant(1);
const toBigInt = constant(1n);

test("empty array", () => {
  const result1 = sumBy([], BigInt);
  expectTypeOf(result1).toEqualTypeOf<0>();

  const result2 = sumBy([], toNumber);
  expectTypeOf(result2).toEqualTypeOf<0>();
});

test("disallow mixed predicate", () => {
  const toNumberOrBigint = constant<bigint | number>(1);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  sumBy([1, 2, 3], toNumberOrBigint);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  pipe([1, 2, 3], sumBy(toNumberOrBigint));
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = sumBy([] as Array<unknown>, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sumBy([] as ReadonlyArray<unknown>, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sumBy([1, 2] as [unknown, ...Array<unknown>], toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = sumBy([1, 2, 3] as const, toNumber);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1, 2] as [unknown, unknown], toNumber);
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
    const result = sumBy([1n, 2n] as [unknown, ...Array<unknown>], toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = sumBy([1n, 2n, 3n] as const, toBigInt);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1n, 2n] as [unknown, unknown], toBigInt);
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

  test("empty array number", () => {
    const result = pipe([] as const, sumBy(toNumber));
    expectTypeOf(result).toEqualTypeOf<0>();
  });

  test("empty array bigint", () => {
    const result = pipe([] as const, sumBy(toBigInt));
    expectTypeOf(result).toEqualTypeOf<0>();
  });
});
