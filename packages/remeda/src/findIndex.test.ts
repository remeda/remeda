import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { filter } from "./filter";
import { findIndex } from "./findIndex";
import { pipe } from "./pipe";

describe("data first", () => {
  test("found", () => {
    expect(findIndex([10, 20, 30], (x) => x === 20)).toBe(1);
  });

  test("not found", () => {
    expect(findIndex([2, 3, 4], (x) => x === 20)).toBe(-1);
  });

  test("empty array", () => {
    expect(findIndex([], constant(true))).toBe(-1);
  });

  test("single item", () => {
    expect(findIndex([10], constant(true))).toBe(0);
  });

  test("reads a hole as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(findIndex([1, , 3], (x) => x === undefined)).toBe(1);
  });

  test("passes NaN to the predicate", () => {
    expect(findIndex([1, NaN], Number.isNaN)).toBe(1);
  });

  test("passes -0 to the predicate", () => {
    expect(findIndex([0, -0], (x) => Object.is(x, -0))).toBe(1);
  });

  test("calls the predicate in order until the first match", () => {
    const data = [10, 20, 30, 40];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value) => value === 30);
    findIndex(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [10, 0, data],
      [20, 1, data],
      [30, 2, data],
    ]);
  });

  test("calls the predicate on every item when nothing matches", () => {
    const data = [10, 20, 30];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >(constant(false));
    findIndex(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      [10, 0, data],
      [20, 1, data],
      [30, 2, data],
    ]);
  });

  test("passes the input array itself as data", () => {
    const data = [10, 20, 30];
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >(constant(false));
    findIndex(data, predicate);

    expect(predicate.mock.calls[0]?.[2]).toBe(data);
  });
});

describe("data last", () => {
  test("found", () => {
    expect(
      pipe(
        [10, 20, 30],
        findIndex((x) => x === 20),
      ),
    ).toBe(1);
  });

  test("not found", () => {
    expect(
      pipe(
        [2, 3, 4],
        findIndex((x) => x === 20),
      ),
    ).toBe(-1);
  });

  test("empty array", () => {
    expect(pipe([], findIndex(constant(true)))).toBe(-1);
  });

  test("counts the index among the items that reach it", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        filter((x) => x % 2 === 0),
        findIndex((x) => x === 4),
      ),
    ).toBe(1);
  });

  test("calls the predicate in order until the first match", () => {
    const predicate = vi.fn<(value: number, index: number) => boolean>(
      (value) => value === 30,
    );
    pipe([10, 20, 30, 40], findIndex(predicate));

    expect(
      predicate.mock.calls.map(([value, index]) => [value, index]),
    ).toStrictEqual([
      [10, 0],
      [20, 1],
      [30, 2],
    ]);
  });

  test("calls the predicate once per item when nothing matches", () => {
    const predicate = vi.fn<(value: number) => boolean>(constant(false));
    pipe([10, 20, 30], findIndex(predicate));

    expect(predicate).toHaveBeenCalledTimes(3);
  });

  test("doesn't call the predicate on an empty array", () => {
    const predicate = vi.fn<(value: number) => boolean>(constant(false));
    pipe([], findIndex(predicate));

    expect(predicate).not.toHaveBeenCalled();
  });
});
