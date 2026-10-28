import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropLast } from "./dropLast";
import { filter } from "./filter";
import { flat } from "./flat";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data first", () => {
  test("empty array", () => {
    expect(dropLast([], 2)).toStrictEqual([]);
  });

  test("n < 0", () => {
    expect(dropLast([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("n === 0", () => {
    expect(dropLast([1, 2, 3, 4, 5], 0)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("n < length", () => {
    expect(dropLast([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2, 3]);
  });

  test("n === length", () => {
    expect(dropLast([1, 2, 3, 4, 5], 5)).toStrictEqual([]);
  });

  test("n > length", () => {
    expect(dropLast([1, 2, 3, 4, 5], 10)).toStrictEqual([]);
  });

  test("should return a new array even if there was no drop", () => {
    const data = [1, 2, 3, 4, 5];
    const result = dropLast(data, 0);

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  test.each([
    [0, [1, 2, 3, 4, 5]],
    [-1, [1, 2, 3, 4, 5]],
    [-Infinity, [1, 2, 3, 4, 5]],
    [NaN, [1, 2, 3, 4, 5]],
    [2, [1, 2, 3]],
    [0.5, [1, 2, 3, 4]],
    [2.5, [1, 2]],
    // Too small to change `5 - n`, but still a partial item.
    [1e-20, [1, 2, 3, 4]],
    [5, []],
    [10, []],
    [Infinity, []],
  ] as const)("count %s", (n, expected) => {
    expect(dropLast([1, 2, 3, 4, 5], n)).toStrictEqual(expected);
  });
});

describe("data last", () => {
  test.each([
    [0, [1, 2, 3, 4, 5]],
    [-1, [1, 2, 3, 4, 5]],
    [-Infinity, [1, 2, 3, 4, 5]],
    [NaN, [1, 2, 3, 4, 5]],
    [2, [1, 2, 3]],
    [0.5, [1, 2, 3, 4]],
    [2.5, [1, 2]],
    // Too small to change `5 - n`, but still a partial item.
    [1e-20, [1, 2, 3, 4]],
    [5, []],
    [10, []],
    [Infinity, []],
  ] as const)("count %s", (n, expected) => {
    expect(pipe([1, 2, 3, 4, 5], dropLast(n))).toStrictEqual(expected);
  });

  test.each([
    [0, [1, 2, 3, 4, 5]],
    [-1, [1, 2, 3, 4, 5]],
    [-Infinity, [1, 2, 3, 4, 5]],
    [NaN, [1, 2, 3, 4, 5]],
    [2, [1, 2, 3]],
    [0.5, [1, 2, 3, 4]],
    [2.5, [1, 2]],
    // Too small to change `5 - n`, but still a partial item.
    [1e-20, [1, 2, 3, 4]],
    [5, []],
    [10, []],
    [Infinity, []],
  ] as const)("count %s in a fused run", (n, expected) => {
    expect(pipe([1, 2, 3, 4, 5], forceFusion(), dropLast(n))).toStrictEqual(
      expected,
    );
  });

  test("empty array in a fused run", () => {
    expect(pipe([], forceFusion(), dropLast(2))).toStrictEqual([]);
  });

  test("stops pulling items once later steps are done", () => {
    const mapper = vi.fn<(x: number) => number>(identity());
    pipe([1, 2, 3, 4, 5], map(mapper), dropLast(2), take(1));

    expect(mapper).toHaveBeenCalledTimes(3);
  });

  test("passes each item on once it can't be among the last n", () => {
    const log: string[] = [];
    pipe(
      [1, 2, 3, 4],
      forceFusion(),
      map((x) => {
        log.push(`before ${x}`);
        return x;
      }),
      dropLast(1),
      map((x) => {
        log.push(`after ${x}`);
        return x;
      }),
    );

    expect(log).toStrictEqual([
      "before 1",
      "before 2",
      "after 1",
      "before 3",
      "after 2",
      "before 4",
      "after 3",
    ]);
  });

  test("index counts the items that reached the step", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5, 6],
        forceFusion(),
        filter((x) => x % 2 === 0),
        dropLast(1),
      ),
    ).toStrictEqual([2, 4]);
  });

  test("index advances across fan-out", () => {
    expect(
      pipe([[1, 2], [3], [4, 5]], forceFusion(), flat(), dropLast(2)),
    ).toStrictEqual([1, 2, 3]);
  });

  test("each pipe starts with nothing held back", () => {
    const dropLastTwo = dropLast(2);
    pipe([1, 2, 3], forceFusion(), dropLastTwo);

    expect(pipe([4, 5, 6], forceFusion(), dropLastTwo)).toStrictEqual([4]);
  });
});
