import { describe, expect, test, vi } from "vitest";
import { map } from "./map";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data first", () => {
  test("should return an array of successively accumulated values", () => {
    expect(
      mapWithFeedback([1, 2, 3, 4, 5], (acc, x) => acc + x, 100),
    ).toStrictEqual([101, 103, 106, 110, 115]);
  });

  test("should use the same accumulator on every iteration if it's mutable, therefore returning an array containing {array length} references to the accumulator.", () => {
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

  test("if an empty array is provided, it should never iterate, returning a new empty array.", () => {
    const data: unknown[] = [];
    const result = mapWithFeedback(data, (acc) => acc, "value");

    expect(result).toStrictEqual([]);
    expect(result).not.toBe(data);
  });

  test("should provide the whole input", () => {
    const data = [1, 2, 3, 4, 5];
    const mock = vi.fn<
      (
        acc: unknown,
        x: unknown,
        index: unknown,
        items: readonly unknown[],
      ) => unknown
    >((_acc, _x, _index, items) => [...items]);

    mapWithFeedback(data, mock, []);

    expect(mock).toHaveNthReturnedWith(1, data);
    expect(mock).toHaveNthReturnedWith(2, data);
    expect(mock).toHaveNthReturnedWith(3, data);
    expect(mock).toHaveNthReturnedWith(4, data);
    expect(mock).toHaveNthReturnedWith(5, data);
  });
});

describe("data last", () => {
  test("should return an array of successively accumulated values", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        mapWithFeedback((acc, x) => acc + x, 100),
      ),
    ).toStrictEqual([101, 103, 106, 110, 115]);
  });

  test("evaluates lazily", () => {
    const counter = vi.fn<(x: number) => number>();
    pipe(
      [1, 2, 3, 4, 5],
      map(counter),
      mapWithFeedback((acc, x) => acc + x, 100),
      take(2),
    );

    expect(counter).toHaveBeenCalledTimes(2);
  });

  test("should track index and progressively include elements from the original array in the items array during each iteration, forming a growing window", () => {
    const lazyItems: number[][] = [];
    const indices: number[] = [];
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

describe("known issues!", () => {
  test("a trailing rest parameter hides `data` from the arity check", () => {
    expect(() =>
      pipe(
        [1, 2, 3],
        mapWithFeedback(
          (
            accumulator: number,
            _value: number,
            _index: number,
            // this callback reports a `length` of 3 and `rest[0]` is
            // `UNEXPECTED_ACCESS_SENTINEL` instead of the items processed so
            // far.
            ...rest: readonly [readonly unknown[]]
          ) => accumulator + rest[0].length,
          0,
        ),
      ),
    ).toThrow(/^Remeda: /u);
  });
});
