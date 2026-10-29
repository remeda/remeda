import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";

describe("data_first", () => {
  test("takeWhile", () => {
    expect(
      takeWhile([1, 2, 3, 4, 3, 2, 1] as const, (x) => x !== 4),
    ).toStrictEqual([1, 2, 3]);
  });

  test("empty array", () => {
    expect(takeWhile([], (x) => x > 0)).toStrictEqual([]);
  });

  test("first item fails", () => {
    expect(takeWhile([1, 2, 3], (x) => x > 1)).toStrictEqual([]);
  });

  test("every item passes", () => {
    expect(takeWhile([1, 2, 3], (x) => x > 0)).toStrictEqual([1, 2, 3]);
  });

  test("stops calling the predicate at the first failing item", () => {
    const predicate = vi.fn<(x: number) => boolean>((x) => x < 3);
    takeWhile([1, 2, 3, 4, 5], predicate);

    expect(predicate).toHaveBeenCalledTimes(3);
  });
});

describe("data_last", () => {
  test("takeWhile", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 3, 2, 1] as const,
        takeWhile((x) => x !== 4),
      ),
    ).toStrictEqual([1, 2, 3]);
  });

  test("in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 3, 2, 1],
        forceFusion(),
        takeWhile((x) => x !== 4),
      ),
    ).toStrictEqual([1, 2, 3]);
  });

  test("empty array in a fused run", () => {
    expect(
      pipe(
        [],
        forceFusion(),
        takeWhile((x) => x > 0),
      ),
    ).toStrictEqual([]);
  });

  test("first item fails in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3],
        forceFusion(),
        takeWhile((x) => x > 1),
      ),
    ).toStrictEqual([]);
  });

  test("every item passes in a fused run", () => {
    expect(
      pipe(
        [1, 2, 3],
        forceFusion(),
        takeWhile((x) => x > 0),
      ),
    ).toStrictEqual([1, 2, 3]);
  });

  test("stops pulling items at the first failing item", () => {
    const mapper = vi.fn<(x: number) => number>(identity());
    pipe(
      [1, 2, 3, 4, 5],
      map(mapper),
      takeWhile((x) => x < 3),
    );

    expect(mapper).toHaveBeenCalledTimes(3);
  });

  test("stops calling the predicate at the first failing item", () => {
    const predicate = vi.fn<(x: number) => boolean>((x) => x < 3);
    pipe([1, 2, 3, 4, 5], forceFusion(), takeWhile(predicate));

    expect(predicate).toHaveBeenCalledTimes(3);
  });

  test("provides the items processed so far to the predicate", () => {
    const dataSnapshots: number[][] = [];
    pipe(
      [1, 2, 3],
      forceFusion(),
      takeWhile((_value, _index, data) => {
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
    pipe([1, 2, 3], forceFusion(), takeWhile(predicate));

    expect(() => predicate.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
  });

  test("index counts the items that reached the step", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5, 6],
        forceFusion(),
        filter((x) => x % 2 === 0),
        takeWhile((_value, index) => index < 2),
      ),
    ).toStrictEqual([2, 4]);
  });
});
