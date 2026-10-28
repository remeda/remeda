import { describe, expect, test, vi } from "vitest";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { take } from "./take";
import { takeFirstBy } from "./takeFirstBy";

describe("runtime (dataFirst)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 2, identity())).toStrictEqual([2, 1]);
  });

  test("handles empty arrays gracefully", () => {
    const data: number[] = [];

    expect(takeFirstBy(data, 1, identity())).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, -3, identity())).toHaveLength(0);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 100, identity())).toHaveLength(data.length);
  });

  test("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = takeFirstBy(data, 100, identity());

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  test("works with complex compare rules", () => {
    const data = [
      "a",
      "aaa",
      "bbbbb",
      "aa",
      "bb",
      "bbb",
      "bbbb",
      "aaaa",
      "b",
      "aaaaa",
    ];

    expect(takeFirstBy(data, 3, (x) => x.length, identity())).toStrictEqual([
      "aa",
      "b",
      "a",
    ]);
  });

  test("a single item", () => {
    expect(takeFirstBy([5], 1, identity())).toStrictEqual([5]);
  });

  test("returns the heap layout when taking fewer than all items", () => {
    expect(takeFirstBy([4, 5, 1, 6, 2, 3, 7], 4, identity())).toStrictEqual([
      4, 3, 1, 2,
    ]);
  });

  test("keeps the input order when taking all items", () => {
    expect(takeFirstBy([3, 1, 2], 3, identity())).toStrictEqual([3, 1, 2]);
  });

  test("floors a fractional n", () => {
    expect(takeFirstBy([3, 1, 2, 5, 4], 2.5, identity())).toStrictEqual([2, 1]);
  });

  test("a fractional n past the length keeps the input order", () => {
    expect(takeFirstBy([3, 1, 2], 3.5, identity())).toStrictEqual([3, 1, 2]);
  });

  test("a fraction below 1 takes nothing", () => {
    expect(takeFirstBy([3, 1, 2], 0.5, identity())).toStrictEqual([]);
  });

  test("n is NaN", () => {
    expect(takeFirstBy([3, 1, 2], NaN, identity())).toStrictEqual([]);
  });

  test("n is Infinity", () => {
    expect(takeFirstBy([3, 1, 2], Infinity, identity())).toStrictEqual([
      3, 1, 2,
    ]);
  });

  test("projects while building the heap, then for each later item", () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2, 5, 4], 2, projection);

    expect(projection.mock.calls).toStrictEqual([
      [3],
      [1],
      [2],
      [3],
      [2],
      [1],
      [5],
      [2],
      [4],
      [2],
    ]);
  });

  test("doesn't project when taking all items", () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2], 3, projection);

    expect(projection).not.toHaveBeenCalled();
  });

  test("doesn't project for a NaN n", () => {
    const projection = vi.fn<(value: number) => number>(identity());

    takeFirstBy([3, 1, 2], NaN, projection);

    expect(projection).not.toHaveBeenCalled();
  });

  test("keeps holes when taking fewer than all items", () => {
    // A NaN projection ties the hole with every item, so the heap never moves
    // it.
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    const result = takeFirstBy([, 5, 3], 2, (value) => value ?? NaN);

    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(result).toStrictEqual([, 5]);
  });

  test("reads holes as undefined when taking all items", () => {
    expect(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      takeFirstBy([, 5, 3], 3, (value) => value ?? NaN),
    ).toStrictEqual([undefined, 5, 3]);
  });
});

describe("runtime (dataLast)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(2, (x) => x),
      ),
    ).toStrictEqual([2, 1]);
  });

  test("handles empty arrays gracefully", () => {
    const data: number[] = [];

    expect(
      pipe(
        data,
        takeFirstBy(1, (x) => x),
      ),
    ).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(-3, (x) => x),
      ),
    ).toHaveLength(0);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(100, (x) => x),
      ),
    ).toHaveLength(data.length);
  });

  test("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      takeFirstBy(100, (x) => x),
    );

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  test("works with complex compare rules", () => {
    const data = [
      "a",
      "aaa",
      "bbbbb",
      "aa",
      "bb",
      "bbb",
      "bbbb",
      "aaaa",
      "b",
      "aaaaa",
    ];

    expect(
      pipe(
        data,
        takeFirstBy(
          3,
          (x) => x.length,
          (x) => x,
        ),
      ),
    ).toStrictEqual(["aa", "b", "a"]);
  });

  test("keeps holes after a lone lazy step", () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [, 5, 3],
        // With no lazy function to fuse with, `take` runs its data-first
        // implementation, a `slice`, which keeps the hole.
        take(Infinity),
        takeFirstBy(2, (value: number | undefined) => value ?? NaN),
      ),
    ).toStrictEqual(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [, 5],
    );
  });
});
