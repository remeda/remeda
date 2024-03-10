import { pipe } from "./pipe";
import { mapWithFeedback } from "./mapWithFeedback";
import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
import { take } from "./take";
import { add } from "./add";

describe("data first", () => {
  describe("base", () => {
    it("should return an array of successively accumulated values", () => {
      const result = mapWithFeedback(
        [1, 2, 3, 4, 5] as const,
        (acc, x) => acc + x,
        100,
      );
      expect(result).toEqual([101, 103, 106, 110, 115]);
    });

    it("should use the same accumulator on every iteration if it's mutable, therefore returning an array containing {array length} references to the accumulator.", () => {
      const results = mapWithFeedback(
        [1, 2, 3, 4, 5] as const,
        (acc, x) => {
          acc[x] = x;
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const expectedEquality = Array.from({ length: 5 }).fill({
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
      });
      expect(results).toEqual(expectedEquality);
      const item = results[0];
      expect(results.every((result) => result === item)).toBe(true);
    });

    it("if an empty array is provided, it should never iterate, returning an empty array.", () => {
      const result = mapWithFeedback([], (acc) => acc, "value");
      expect(result).toEqual([]);
    });

    it("should be compatible with transformer functions", () => {
      expect(() => {
        const result = mapWithFeedback([1, 2, 3, 4, 5], add, 100);
        expect(result).toEqual([101, 103, 106, 110, 115]);
      }).not.toThrowError("Wrong number of arguments");
    });

    it("indexed should not be compatible with transformer functions", () => {
      expect(() => {
        const result = mapWithFeedback.indexed([1, 2, 3, 4, 5], add, 100);
        expect(result).toEqual([101, 103, 106, 110, 115]);
      }).toThrowError("Wrong number of arguments");
    });

    it("should return an Array<accumulator type>", () => {
      const result = mapWithFeedback(
        [1, 2, 3, 4, 5] as const,
        (acc, x) => acc + x,
        100,
      );
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });
  });

  describe("indexed", () => {
    it("should track index and provide entire items array", () => {
      let i = 0;
      expect(
        mapWithFeedback.indexed(
          [1, 2, 3, 4, 5] as const,
          (acc, x, index, items) => {
            expect(index).toBe(i);
            expect(items).toEqual([1, 2, 3, 4, 5] as const);
            i++;
            return acc + x;
          },
          100,
        ),
      ).toEqual([101, 103, 106, 110, 115]);
    });

    it("should return an Array<accumulator type>", () => {
      const result = mapWithFeedback.indexed(
        [1, 2, 3, 4, 5] as const,
        (acc, x) => acc + x,
        100,
      );
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    it("the items array passed to the callback should be an array type containing the union type of all of the members in the original array", () => {
      mapWithFeedback.indexed(
        [1, 2, 3, 4, 5] as const,
        (acc, x, _index, items) => {
          expectTypeOf(items).toEqualTypeOf<ReadonlyArray<1 | 2 | 3 | 4 | 5>>();
          return acc + x;
        },
        100,
      );
    });
  });
});

describe("data last", () => {
  describe("base", () => {
    it("should return an array of successively accumulated values", () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5] as const,
          mapWithFeedback((acc, x) => acc + x, 100),
        ),
      ).toEqual([101, 103, 106, 110, 115]);
    });

    it("evaluates lazily", () => {
      const counter = createLazyInvocationCounter();
      pipe(
        [1, 2, 3, 4, 5] as const,
        counter.fn(),
        mapWithFeedback((acc, x) => acc + x, 100),
        take(2),
      );
      expect(counter.count).toHaveBeenCalledTimes(2);
    });

    it("should return an Array<accumulator type>", () => {
      const result = pipe(
        [1, 2, 3, 4, 5] as const,
        mapWithFeedback((acc, x) => acc + x, 100),
      );
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });
  });

  describe("indexed", () => {
    it("should track index and progressively include elements from the original array in the items array during each iteration, forming a growing window", () => {
      const lazyItems: Array<Array<number>> = [];
      const indices: Array<number> = [];
      pipe(
        [1, 2, 3, 4, 5] as const,
        mapWithFeedback.indexed((acc, x, index, items) => {
          indices.push(index);
          lazyItems.push([...items]);
          return acc + x;
        }, 100),
      );
      expect(indices).toEqual([0, 1, 2, 3, 4]);
      expect(lazyItems).toEqual([
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5],
      ]);
    });

    it("evaluates lazily", () => {
      const counter = createLazyInvocationCounter();
      pipe(
        [1, 2, 3, 4, 5] as const,
        counter.fn(),
        mapWithFeedback.indexed((acc, x) => acc + x, 100),
        take(2),
      );
      expect(counter.count).toHaveBeenCalledTimes(2);
    });

    it("should return an Array<accumulator type>", () => {
      const result = pipe(
        [1, 2, 3, 4, 5] as const,
        mapWithFeedback.indexed((acc, x) => acc + x, 100),
      );
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });
  });
});
