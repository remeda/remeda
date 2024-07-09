import { pipe } from "./pipe";
import { sum } from "./sum";

test("empty arrays", () => {
  const result = sum([] as const);
  expectTypeOf(result).toEqualTypeOf<0>();
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = sum([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sum([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sum([1, 2] as [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = sum([1, 2, 3] as const);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = sum([1, 2] as [number, number]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("bigints", () => {
  test("arbitrary arrays", () => {
    const result = sum([] as Array<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary readonly arrays", () => {
    const result = sum([] as ReadonlyArray<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = sum([1n, 2n] as [bigint, ...Array<bigint>]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = sum([1n, 2n, 3n] as const);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = sum([1n, 2n] as [bigint, bigint]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, sum());
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("bigints", () => {
    const result = pipe([1n, 2n, 3n] as const, sum());
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

it("doesn't allow mixed arrays", () => {
  // @ts-expect-error [ts2345] - Can't sum bigints and numbers...
  sum([1, 2n]);
});

describe("KNOWN ISSUES", () => {
  it("Returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays", () => {
    const result = sum([] as Array<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });
});
