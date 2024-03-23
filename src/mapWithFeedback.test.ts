import { map } from "./map";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";
import { take } from "./take";

describe("runtime", () => {
  describe("data first", () => {
    it("should return an array of successively accumulated values", () => {
      expect(
        mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100),
      ).toStrictEqual([101, 103, 106, 110, 115]);
    });

    it("should use the same accumulator on every iteration if it's mutable, therefore returning an array containing {array length} references to the accumulator.", () => {
      const results = mapWithFeedback(
        [1, 2, 3, 4, 5],
        (acc, x) => {
          acc[x] = x;
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const [item] = results;
      expect(item).toStrictEqual({ "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 });
      for (const result of results) {
        expect(result).toBe(item);
      }
    });

    it("if an empty array is provided, it should never iterate, returning a new empty array.", () => {
      const data: Array<unknown> = [];
      const result = mapWithFeedback(data, (acc) => acc, "value");
      expect(result).toStrictEqual([]);
      expect(result).not.toBe(data);
    });

    it("should track index and provide entire items array", () => {
      const data = [1, 2, 3, 4, 5];

      const mockedReducer = vi.fn(
        (
          acc: number,
          x: number,
          _index: number,
          _items: ReadonlyArray<number>,
        ) => acc + x,
      );

      mapWithFeedback(data, mockedReducer, 100);

      expect(mockedReducer).toHaveBeenCalledWith(100, 1, 0, data);
      expect(mockedReducer).toHaveBeenCalledWith(101, 2, 1, data);
      expect(mockedReducer).toHaveBeenCalledWith(103, 3, 2, data);
      expect(mockedReducer).toHaveBeenCalledWith(106, 4, 3, data);
      expect(mockedReducer).toHaveBeenCalledWith(110, 5, 4, data);
    });
  });

  describe("data last", () => {
    it("should return an array of successively accumulated values", () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5],
          mapWithFeedback((acc, x) => acc + x, 100),
        ),
      ).toStrictEqual([101, 103, 106, 110, 115]);
    });

    it("evaluates lazily", () => {
      const counter = vi.fn((x: number) => x);
      pipe(
        [1, 2, 3, 4, 5],
        map(counter),
        mapWithFeedback((acc, x) => acc + x, 100),
        take(2),
      );
      expect(counter).toHaveBeenCalledTimes(2);
    });

    it("should track index and progressively include elements from the original array in the items array during each iteration, forming a growing window", () => {
      const lazyItems: Array<Array<number>> = [];
      const indices: Array<number> = [];
      pipe(
        [1, 2, 3, 4, 5],
        mapWithFeedback((acc, x, index, items) => {
          indices.push(index);
          lazyItems.push([...items]);
          return acc + x;
        }, 100),
      );
      expect(indices).toStrictEqual([0, 1, 2, 3, 4]);
      expect(lazyItems).toStrictEqual([
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5],
      ]);
    });
  });
});

describe("typing", () => {
  it("should return a mutable tuple type whose length matches input container's length, consisting of the type of the initial value", () => {
    const result = mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100);
    expectTypeOf(result).toEqualTypeOf<
      [number, number, number, number, number]
    >();
  });

  it("should return a tuple consisting of the initial value type even if the initial iterable contains a different type", () => {
    const result = mapWithFeedback(
      ["1", "2", "3", "4", "5"],
      (acc, x) => acc + parseInt(x),
      100,
    );
    expectTypeOf(result).toEqualTypeOf<
      [number, number, number, number, number]
    >();
  });

  it("should correctly infer type with a non-literal array type", () => {
    const result = mapWithFeedback(
      [1, 2, 3, 4, 5] as Array<number>,
      (acc, x) => acc + x,
      100,
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("should return a tuple consisting of the initial value type even if the initial iterable contains a different type", () => {
    const result = pipe(
      [1, 2, 3, 4, 5] as const,
      mapWithFeedback((acc, x) => acc + x, 100),
    );
    expectTypeOf(result).toEqualTypeOf<
      [number, number, number, number, number]
    >();
  });

  it("the items array passed to the callback should be an array type containing the union type of all of the members in the original array", () => {
    mapWithFeedback(
      [1, 2, 3, 4, 5] as const,
      (acc, x, _index, items) => {
        expectTypeOf(items).toEqualTypeOf<readonly [1, 2, 3, 4, 5]>();
        return acc + x;
      },
      100,
    );
  });
});
