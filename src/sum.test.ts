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
  it("returns number on numbers", () => {
    const result = sum([1, 2, 3]);
    expectTypeOf(result).toEqualTypeOf<number>();
  });

  it("returns bigint on bigints", () => {
    const result = sum([1n, 2n, 3n]);
    expectTypeOf(result).toEqualTypeOf<bigint>();
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
    expectTypeOf(result).toEqualTypeOf<bigint>();
  });
});
