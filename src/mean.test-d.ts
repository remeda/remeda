import { mean } from "./mean";
import { pipe } from "./pipe";

test("empty arrays", () => {
  const result = mean([] as const);
  expectTypeOf(result).toEqualTypeOf<undefined>();
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = mean([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary readonly arrays", () => {
    const result = mean([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = mean([1, 2] as [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("consts", () => {
    const result = mean([1, 2, 3] as const);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("fixed-size tuples", () => {
    const result = mean([1, 2] as [number, number]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });
});

describe("bigints", () => {
  test("arbitrary arrays", () => {
    const result = mean([] as Array<bigint>);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("arbitrary readonly arrays", () => {
    const result = mean([] as ReadonlyArray<bigint>);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("arbitrary non-empty arrays", () => {
    const result = mean([1n, 2n] as [bigint, ...Array<bigint>]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("consts", () => {
    const result = mean([1n, 2n, 3n] as const);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });

  test("fixed-size tuples", () => {
    const result = mean([1n, 2n] as [bigint, bigint]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

describe("dataLast", () => {
  test("numbers", () => {
    const result = pipe([1, 2, 3] as const, mean());
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  test("bigints", () => {
    const result = pipe([1n, 2n, 3n] as const, mean());
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});

it("doesn't allow mixed arrays", () => {
  // @ts-expect-error [ts2345] - Can't mean bigints and numbers...
  mean([1, 2n]);
});
