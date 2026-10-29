import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropWhile } from "./dropWhile";
import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { piped } from "./piped";
import { take } from "./take";

describe("data first", () => {
  test("should return items starting from the first predicate failure", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n !== 3)).toStrictEqual([3, 4]);
  });

  test("should return an empty array when all items pass the predicate", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n > 0)).toStrictEqual([]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(dropWhile([], (n) => n > 0)).toStrictEqual([]);
  });

  test("should return last item when last item fails the predicate", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n !== 4)).toStrictEqual([4]);
  });

  test("should return a copy of the array when the first item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = dropWhile(data, (n) => n !== 1);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  test("stops calling the predicate at the first failing item", () => {
    const predicate = vi.fn<(x: number) => boolean>((x) => x < 3);
    dropWhile([1, 2, 3, 1, 2], predicate);

    expect(predicate).toHaveBeenCalledTimes(3);
  });
});

describe("data last", () => {
  test("should return items starting from the first predicate failure", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n !== 3),
      ),
    ).toStrictEqual([3, 4]);
  });

  test("should return an empty array when all items pass the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(
      pipe(
        [],
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("should return last item when last item fails the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n !== 4),
      ),
    ).toStrictEqual([4]);
  });

  test("should return a copy of the array when the first item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = pipe(
      data,
      dropWhile((n) => n !== 1),
    );

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  test("in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        forceFusion(),
        dropWhile((n) => n !== 3),
      ),
    ).toStrictEqual([3, 4]);
  });

  test("every item passes in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        forceFusion(),
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("empty array in a fused run", () => {
    expect(
      pipe(
        [],
        forceFusion(),
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("first item fails in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        forceFusion(),
        dropWhile((n) => n !== 1),
      ),
    ).toStrictEqual([1, 2, 3, 4]);
  });

  test("stops pulling items once later steps are done", () => {
    const mapper = vi.fn<(x: number) => number>(identity());
    pipe(
      [1, 2, 3, 4, 5],
      map(mapper),
      dropWhile((x) => x < 3),
      take(2),
    );

    expect(mapper).toHaveBeenCalledTimes(4);
  });

  test("stops calling the predicate at the first failing item", () => {
    const predicate = vi.fn<(x: number) => boolean>((x) => x < 3);
    pipe([1, 2, 3, 1, 2], forceFusion(), dropWhile(predicate));

    expect(predicate).toHaveBeenCalledTimes(3);
  });

  test("provides the items processed so far to the predicate", () => {
    const dataSnapshots: number[][] = [];
    pipe(
      [1, 2, 3],
      forceFusion(),
      dropWhile((_value, _index, data) => {
        dataSnapshots.push([...data]);
        return true;
      }),
    );

    expect(dataSnapshots).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
  });

  test("doesn't collect the items processed so far for a predicate without `data`", () => {
    // `vi.fn` keeps its implementation's `length`, which is all the arity
    // check reads.
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value, index) => value > index);
    pipe([1, 2, 3], forceFusion(), dropWhile(predicate));

    expect(() => predicate.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
  });

  test("index counts the items that reached the step", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5, 6],
        forceFusion(),
        filter((x) => x % 2 === 0),
        dropWhile((_value, index) => index < 1),
      ),
    ).toStrictEqual([4, 6]);
  });

  test("each pipe starts dropping anew", () => {
    expect(
      map(
        [
          [1, 3, 1],
          [1, 4, 1],
        ],
        piped(
          forceFusion(),
          dropWhile((x) => x < 3),
        ),
      ),
    ).toStrictEqual([
      [3, 1],
      [4, 1],
    ]);
  });

  test("earlier steps see the whole input", () => {
    expect(
      pipe(
        [1, 2, 3],
        map((_x, _index, { length }) => length),
        dropWhile((x) => x < 2),
      ),
    ).toStrictEqual([3, 3, 3]);
  });
});
