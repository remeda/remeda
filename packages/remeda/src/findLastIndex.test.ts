import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { findLastIndex } from "./findLastIndex";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findLastIndex", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(2);
  });

  test("findLast first value", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 1)).toBe(0);
  });

  test("findLastIndex -1", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 5)).toBe(-1);
  });

  test("returns -1 for an empty array", () => {
    expect(findLastIndex([], constant(true))).toBe(-1);
  });

  test("doesn't call the predicate on an empty array", () => {
    const predicate = vi.fn<(value: number) => boolean>();

    findLastIndex([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  test("a single item", () => {
    expect(findLastIndex([5], constant(true))).toBe(0);
  });

  test("scans backward and stops at the first match", () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value) => value === 2);

    findLastIndex(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [4, 3, data],
      [3, 2, data],
      [2, 1, data],
    ]);
  });

  test("scans every item backward when nothing matches", () => {
    const data = [1, 2, 3];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >(constant(false));

    findLastIndex(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  test("reads holes as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(findLastIndex([1, , 3], (value) => value === undefined)).toBe(1);
  });
});

describe("data last", () => {
  test("found", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x % 2 === 1),
      ),
    ).toBe(2);
  });

  test("not found", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x === 5),
      ),
    ).toBe(-1);
  });

  test("returns -1 for an empty array", () => {
    expect(pipe([], findLastIndex(constant(true)))).toBe(-1);
  });
});
