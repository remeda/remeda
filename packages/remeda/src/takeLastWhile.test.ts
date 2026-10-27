import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { pipe } from "./pipe";
import { take } from "./take";
import { takeLastWhile } from "./takeLastWhile";

describe("data first", () => {
  test("should return items after the last predicate failure", () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 2)).toStrictEqual([3, 4]);
  });

  test("should return an empty array when the last item fails the predicate", () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 4)).toStrictEqual([]);
  });

  test("should return rest of the items when first item fails the predicate", () => {
    expect(takeLastWhile([1, 2, 3, 4], (n) => n !== 1)).toStrictEqual([
      2, 3, 4,
    ]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(takeLastWhile([], (n) => n > 0)).toStrictEqual([]);
  });

  test("should return a copy of the original array when all items pass the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = takeLastWhile(data, (n) => n > 0);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  test("doesn't call the predicate on an empty array", () => {
    const predicate = vi.fn<(value: number) => boolean>();

    takeLastWhile([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  test("a single passing item", () => {
    expect(takeLastWhile([5], constant(true))).toStrictEqual([5]);
  });

  test("a single failing item", () => {
    expect(takeLastWhile([5], constant(false))).toStrictEqual([]);
  });

  test("scans backward and stops at the first failure", () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value) => value !== 2);

    takeLastWhile(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [4, 3, data],
      [3, 2, data],
      [2, 1, data],
    ]);
  });

  test("scans every item backward when all pass", () => {
    const data = [1, 2, 3];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >(constant(true));

    takeLastWhile(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  test("keeps holes after the last failure", () => {
    expect(
      takeLastWhile(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [0, , 3],
        (value) => value !== 0,
      ),
    ).toStrictEqual(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [, 3],
    );
  });

  test("reads holes as undefined when every item passes", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(takeLastWhile([1, , 3], constant(true))).toStrictEqual([
      1,
      undefined,
      3,
    ]);
  });
});

describe("data last", () => {
  test("should return items after the last predicate failure", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 2),
      ),
    ).toStrictEqual([3, 4]);
  });

  test("should return an empty array when the last item fails the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 4),
      ),
    ).toStrictEqual([]);
  });

  test("should return rest of the items when first item fails the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        takeLastWhile((n) => n !== 1),
      ),
    ).toStrictEqual([2, 3, 4]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(
      pipe(
        [],
        takeLastWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("should return a copy of the original array when all items pass the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = pipe(
      data,
      takeLastWhile((n) => n > 0),
    );

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  test("keeps holes after a lone lazy step", () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [0, , 3],
        // With no lazy function to fuse with, `take` runs its data-first
        // implementation, a `slice`, which keeps the hole.
        take(Infinity),
        takeLastWhile((value) => value !== 0),
      ),
    ).toStrictEqual(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      [, 3],
    );
  });
});
