import { pipe } from "./pipe";
import { product } from "./product";

describe("runtime", () => {
  describe("dataFirst", () => {
    it("should return the product of numbers in the array", () => {
      expect(product([1, 2, 3])).toBe(6);
      expect(product([4, 5, 6])).toBe(120);
      expect(product([0, 1, 2])).toBe(0);
      expect(product([-1, -2, -3])).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(product([])).toBe(1);
    });

    it("works with bigints", () => {
      expect(product([1n, 2n, 3n])).toBe(6n);
    });
  });

  describe("dataLast", () => {
    it("should return the product of numbers in the array", () => {
      expect(pipe([1, 2, 3], product())).toBe(6);
      expect(pipe([4, 5, 6], product())).toBe(120);
      expect(pipe([0, 1, 2], product())).toBe(0);
      expect(pipe([-1, -2, -3], product())).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(pipe([], product())).toBe(1);
    });
  });
});

describe("typing", () => {
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

  it("doesn't allow mixed arrays", () => {
    expect(() =>
      // @ts-expect-error [ts2345] - Can't product bigints and numbers...
      product([1, 2n]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Cannot mix BigInt and other types, use explicit conversions]`,
    );
  });
});

describe("KNOWN ISSUES", () => {
  it("Returns 1 (`number`) instead of 1n (`bigint`) for empty `bigint` arrays", () => {
    const result = product([] as Array<bigint>);
    expect(result).toBe(1);
    expectTypeOf(result).toEqualTypeOf<bigint | 1>();
  });
});
