import { describe, expect, test, vi } from "vitest";
import { add } from "./add";
import { pipe } from "./pipe";
import { reduce } from "./reduce";
import { take } from "./take";

describe("data first", () => {
  test("reduce", () => {
    expect(reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100)).toBe(115);
  });

  test("indexed", () => {
    const data = [1, 2, 3, 4, 5];
    let i = 0;

    expect(
      reduce(
        data,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toBe(data);

          i += 1;
          return acc + x;
        },
        100,
      ),
    ).toBe(115);
  });

  test("a purried reducer runs data-first", () => {
    expect(reduce([1, 2, 3], add, 0)).toBe(6);
  });

  test("returns the initial value for an empty array", () => {
    expect(
      reduce([], (accumulator: number, item: number) => accumulator + item, 7),
    ).toBe(7);
  });

  test("doesn't call the reducer on an empty array", () => {
    const reducer = vi.fn<(accumulator: number, item: number) => number>();

    reduce([], reducer, 7);

    expect(reducer).not.toHaveBeenCalled();
  });

  test("a single item", () => {
    expect(reduce([5], (accumulator, item) => accumulator + item, 1)).toBe(6);
  });

  test("calls the reducer on each item in order with the whole array", () => {
    const data = [1, 2, 3];
    const reducer = vi.fn<
      (
        accumulator: number,
        item: number,
        index: number,
        data: readonly number[],
      ) => number
    >((accumulator, item) => accumulator + item);

    reduce(data, reducer, 100);

    expect(reducer.mock.calls).toStrictEqual([
      [100, 1, 0, data],
      [101, 2, 1, data],
      [103, 3, 2, data],
    ]);
  });

  test("skips holes", () => {
    expect(
      reduce(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3],
        (indices: readonly number[], _item, index) => [...indices, index],
        [],
      ),
    ).toStrictEqual([0, 2]);
  });
});

describe("data last", () => {
  test("reduce", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        reduce((acc, x) => acc + x, 100),
      ),
    ).toBe(115);
  });

  test("returns the initial value for an empty array", () => {
    expect(
      pipe(
        [],
        reduce((accumulator: number, item: number) => accumulator + item, 7),
      ),
    ).toBe(7);
  });

  test("skips holes like data-first", () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3],
        reduce(
          (indices: readonly number[], _item, index) => [...indices, index],
          [],
        ),
      ),
    ).toStrictEqual([0, 2]);
  });

  test("skips holes after a lone lazy step", () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3],
        // With no lazy function to fuse with, `take` runs its data-first
        // implementation, a `slice`, which keeps the hole.
        take(Infinity),
        reduce(
          (indices: readonly number[], _item, index) => [...indices, index],
          [],
        ),
      ),
    ).toStrictEqual([0, 2]);
  });
});
