import { hasAtLeast } from "./hasAtLeast";
import { isEmpty } from "./isEmpty";
import { mean } from "./mean";
import { pipe } from "./pipe";

test("empty arrays", () => {
  const result = mean([] as const);
  expectTypeOf(result).toEqualTypeOf<undefined>();
});

describe("numbers", () => {
  test("arbitrary arrays", () => {
    const result = mean([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly arrays", () => {
    const result = mean([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
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
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly arrays", () => {
    const result = mean([] as ReadonlyArray<bigint>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
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

  test("arbitrary number arrays", () => {
    const result = pipe([] as Array<number>, mean());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly number arrays", () => {
    const result = pipe([] as ReadonlyArray<number>, mean());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary bigint arrays", () => {
    const result = pipe([] as Array<bigint>, mean());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("arbitrary readonly bigint arrays", () => {
    const result = pipe([] as ReadonlyArray<bigint>, mean());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });
});

describe("type-guards", () => {
  it("narrows to `number` using `hasAtLeast`", () => {
    const data = [] as Array<number>;
    if (hasAtLeast(data, 1)) {
      expectTypeOf(mean(data)).toEqualTypeOf<number>();
    }
  });

  it("narrows to `undefined` using `isEmpty`", () => {
    const data = [] as Array<number>;
    if (isEmpty(data)) {
      expectTypeOf(mean(data)).toEqualTypeOf<undefined>();
    }
  });
});

it("doesn't allow mixed arrays", () => {
  // @ts-expect-error [ts2345] - Can't mean bigints and numbers...
  mean([1, 2n]);
});
