import { sumBy } from "./sumBy";
import { pipe } from "./pipe";
import { constant } from "./constant";

test("empty array", () => {
  const result1 = sumBy([], constant(1n));
  expectTypeOf(result1).toEqualTypeOf<0>();

  const result2 = sumBy([], constant(1));
  expectTypeOf(result2).toEqualTypeOf<0>();
});

test("disallow mixed predicate", () => {
  const toNumberOrBigint = constant(1 as bigint | number);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  sumBy([], toNumberOrBigint);
  // @ts-expect-error [ts2769]: Type `number | bigint` is not assignable to type number
  // Type `number | bigint` is not assignable to type bigint
  pipe([], sumBy(toNumberOrBigint));
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = sumBy([] as Array<unknown>, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sumBy([] as ReadonlyArray<unknown>, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sumBy([1, 2] as [unknown, ...Array<unknown>], constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = sumBy([1, 2, 3] as const, constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1, 2] as [unknown, unknown], constant(1));
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("bigints", () => {
  test("arbitrary arrays", () => {
    const result = sumBy([] as Array<unknown>, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sumBy([] as ReadonlyArray<unknown>, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sumBy(
      [1n, 2n] as [unknown, ...Array<unknown>],
      constant(1n),
    );
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = sumBy([1n, 2n, 3n] as const, constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = sumBy([1n, 2n] as [unknown, unknown], constant(1n));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, sumBy(constant(1)));
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("bigints", () => {
    const result = pipe([1n, 2n, 3n] as const, sumBy(constant(1n)));
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("empty array number", () => {
    const result = pipe([] as const, sumBy(constant(1)));
    expectTypeOf(result).toEqualTypeOf<0>();
  });

  test("empty array bigint", () => {
    const result = pipe([] as const, sumBy(constant(1n)));
    expectTypeOf(result).toEqualTypeOf<0>();
  });
});
