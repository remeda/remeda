import { pipe } from "./pipe";
import { sum } from "./sum";

describe("runtime", () => {
  describe("dataFirst", () => {
    it("should return the sum of numbers in an array", () => {
      expect(sum([1, 2, 3])).toBe(6);
      expect(sum([4, 5, 6])).toBe(15);
      expect(sum([-1, 0, 1])).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(sum([])).toBe(0);
    });

    it("works on bigints", () => {
      expect(sum([1n, 2n, 3n])).toBe(6n);
    });
  });

  describe("dataLast", () => {
    it("should return the sum of numbers in an array", () => {
      expect(pipe([1, 2, 3], sum())).toBe(6);
      expect(pipe([4, 5, 6], sum())).toBe(15);
      expect(pipe([-1, 0, 1], sum())).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(pipe([], sum())).toBe(0);
    });
  });
});

describe("typing", () => {
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

  it("doesn't allow mixed arrays", () => {
    expect(() =>
      // @ts-expect-error [ts2345] - Can't sum bigints and numbers...
      sum([1, 2n]),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Cannot mix BigInt and other types, use explicit conversions]`,
    );
  });
});

describe("KNOWN ISSUES", () => {
  it("Returns 0 (`number`) instead of 0n (`bigint`) for empty `bigint` arrays", () => {
    const result = sum([] as Array<bigint>);
    expect(result).toBe(0);
    expectTypeOf(result).toEqualTypeOf<bigint | 0>();
  });
});
