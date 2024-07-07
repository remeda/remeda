import { constant } from "./constant";
import { identity } from "./identity";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { times } from "./times";

describe("times", () => {
  describe("data_first", () => {
    it("returns a trivial empty array for non-positive values", () => {
      const zeroResult = times(0, identity());
      expect(zeroResult).toStrictEqual([]);

      const negativeResult = times(-1000, identity());
      expect(negativeResult).toStrictEqual([]);

      // Make sure that the array returned is new, and not the same copy.
      expect(zeroResult).not.toBe(negativeResult);

      expect(times(-5.5, identity())).toStrictEqual([]);
    });

    it("creates an array of the correct length", () => {
      expect(times(123 as number, constant(1))).toHaveLength(123);
    });

    it("passes idx to fn", () => {
      const fn = vi.fn();
      times(5, fn);
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it("returns fn results as arr", () => {
      expect(times(5, identity())).toStrictEqual([0, 1, 2, 3, 4]);
      expect(times(5, multiply(2))).toStrictEqual([0, 2, 4, 6, 8]);
    });

    it("rounds down non-integer numbers", () => {
      expect(times(5.5, identity())).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });

  describe("data_last", () => {
    it("returns a trivial empty array for non-positive values", () => {
      const zeroResult = pipe(0, times(identity()));
      expect(zeroResult).toStrictEqual([]);

      const negativeResult = pipe(-1000, times(identity()));
      expect(negativeResult).toStrictEqual([]);

      // Make sure that the array returned is new, and not the same copy.
      expect(zeroResult).not.toBe(negativeResult);

      expect(pipe(-5.5, times(identity()))).toStrictEqual([]);
    });

    it("creates an array of the correct length", () => {
      expect(pipe(123 as number, times(constant(1)))).toHaveLength(123);
    });

    it("passes idx to fn", () => {
      const fn = vi.fn();
      pipe(5, times(fn));
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it("returns fn results as arr", () => {
      expect(pipe(5, times(identity()))).toStrictEqual([0, 1, 2, 3, 4]);
      expect(pipe(5, times(multiply(2)))).toStrictEqual([0, 2, 4, 6, 8]);
    });

    it("rounds down non-integer numbers", () => {
      expect(pipe(5.5, times(identity()))).toStrictEqual([0, 1, 2, 3, 4]);
    });
  });
});

describe("typing", () => {
  it("works with 0", () => {
    const result = times(0, identity());
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it("works with non-literals", () => {
    const result = times(10 as number, identity());
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("works with positive integer literals", () => {
    const result = times(10, identity());
    expectTypeOf(result).toEqualTypeOf<
      [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]
    >();
  });

  it("works with negative integers", () => {
    const result = times(-10, identity());
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it("works with non-integer positive literals", () => {
    const result = times(10.5, identity());
    expectTypeOf(result).toEqualTypeOf<
      [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]
    >();
  });

  it("works with non-integer negative literals", () => {
    const result = times(-10.5, identity());
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it("works with literal unions", () => {
    const result = times(1 as 1 | 3, identity());
    expectTypeOf(result).toEqualTypeOf<[number, number, number] | [number]>();
  });

  it("could be 'disabled' with large literals", () => {
    const largeNumber = 10_000;

    // @ts-expect-error [ts(2589)] - Intentionally bringing typescript to it's limits
    times(largeNumber, identity());

    times(largeNumber as number, identity());
  });
});
