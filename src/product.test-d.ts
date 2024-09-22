import { pipe } from "./pipe";
import { product } from "./product";

test("empty arrays", () => {
  const result = product([] as const);
  expectTypeOf(result).toEqualTypeOf<1>();
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = product([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = product([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = product([1, 2] as [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = product([1, 2, 3] as const);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = product([1, 2] as [number, number]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("bigints", () => {
  test("arbitrary arrays", () => {
    const result = product([] as Array<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 1>();
  });

  test("arbitrary readonly arrays", () => {
    const result = product([] as ReadonlyArray<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 1>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = product([1n, 2n] as [bigint, ...Array<bigint>]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = product([1n, 2n, 3n] as const);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = product([1n, 2n] as [bigint, bigint]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, product());
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("bigints", () => {
    const result = pipe([1n, 2n, 3n] as const, product());
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

it("doesn't allow mixed arrays", () => {
  // @ts-expect-error [ts2345] - Can't product bigints and numbers...
  product([1, 2n]);
});

describe("kNOWN ISSUES", () => {
  it("returns 1 (`number`) instead of 1n (`bigint`) for empty `bigint` arrays", () => {
    const result = product([] as Array<bigint>);
    expectTypeOf(result).toEqualTypeOf<bigint | 1>();
  });
});
