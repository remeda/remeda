import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { findLast } from "./findLast";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findLast", () => {
    expect(findLast([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(3);
  });

  test("indexed", () => {
    expect(findLast([1, 2, 3, 4], (x, i) => x === 3 && i === 2)).toBe(3);
  });

  test("findLast first value", () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 1)).toBe(1);
  });

  test("findLast no match", () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 5)).toBeUndefined();
  });

  test("returns undefined for an empty array", () => {
    expect(findLast([], constant(true))).toBeUndefined();
  });

  test("doesn't call the predicate on an empty array", () => {
    const predicate = vi.fn<(value: number) => boolean>();

    findLast([], predicate);

    expect(predicate).not.toHaveBeenCalled();
  });

  test("a single item", () => {
    expect(findLast([5], constant(true))).toBe(5);
  });

  test("scans backward and stops at the first match", () => {
    const data = [1, 2, 3, 4];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value) => value === 2);

    findLast(data, predicate);

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

    findLast(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [2, 1, data],
      [1, 0, data],
    ]);
  });

  test("returns the last of same-shape matches by reference", () => {
    const first = { id: 0 };
    const second = { id: 0 };

    expect(findLast([first, second], constant(true))).toBe(second);
  });

  test("returns -0 when it is the last match", () => {
    expect(findLast([0, -0], (value) => value === 0)).toBe(-0);
  });

  test("reads holes as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    const data = [1, , 3];
    const predicate = vi.fn<
      (
        value: number | undefined,
        index: number,
        data: readonly (number | undefined)[],
      ) => boolean
    >(constant(false));

    findLast(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [3, 2, data],
      [undefined, 1, data],
      [1, 0, data],
    ]);
  });
});

describe("data last", () => {
  test("findLast", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x) => x % 2 === 1),
      ),
    ).toBe(3);
  });

  test("indexed", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x, i) => x === 3 && i === 2),
      ),
    ).toBe(3);
  });

  test("returns undefined for an empty array", () => {
    expect(pipe([], findLast(constant(true)))).toBeUndefined();
  });
});
