import { describe, expect, test, vi } from "vitest";
import { drop } from "./drop";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data first", () => {
  test("works on regular inputs", () => {
    expect(drop([1, 2, 3, 4, 5], 2)).toStrictEqual([3, 4, 5]);
  });

  test("works trivially on empty arrays", () => {
    expect(drop([], 2)).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(drop([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("works when dropping more than the length of the array", () => {
    expect(drop([1, 2, 3, 4, 5], 10)).toStrictEqual([]);
  });

  test("returns a shallow clone when no items are dropped", () => {
    const data = [1, 2, 3, 4, 5];
    const result = drop(data, 0);

    expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(data);
  });
});

describe("data last", () => {
  test("works on regular inputs", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(2))).toStrictEqual([3, 4, 5]);
  });

  test("works trivially on empty arrays", () => {
    expect(pipe([], drop(2))).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(-1))).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("works when dropping more than the length of the array", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(10))).toStrictEqual([]);
  });

  test.each([
    [2.5, [3, 4, 5]],
    [1.5, [2, 3, 4, 5]],
    [0.5, [1, 2, 3, 4, 5]],
  ])("truncates a count of %s", (n, expected) => {
    expect(pipe([1, 2, 3, 4, 5], drop(n))).toStrictEqual(expected);
  });

  test.each([
    [2.5, [3, 4, 5]],
    [1.5, [2, 3, 4, 5]],
    [0.5, [1, 2, 3, 4, 5]],
  ])("truncates a count of %s in a fused run", (n, expected) => {
    // The trailing `take` can stop the run early, so `pipe` has to run it lazily.
    expect(
      pipe([1, 2, 3, 4, 5], map(identity()), drop(n), take(5)),
    ).toStrictEqual(expected);
  });

  test("reads a NaN count as 0", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(NaN))).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("reads a NaN count as 0 in a fused run", () => {
    expect(
      pipe([1, 2, 3, 4, 5], map(identity()), drop(NaN), take(5)),
    ).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("drops everything for an Infinity count", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(Infinity))).toStrictEqual([]);
  });

  test("drops everything for an Infinity count in a fused run", () => {
    expect(
      pipe([1, 2, 3, 4, 5], map(identity()), drop(Infinity), take(5)),
    ).toStrictEqual([]);
  });

  test("lazy impl", () => {
    const mapper = vi.fn<(x: number) => number>();
    pipe([1, 2, 3, 4, 5], map(mapper), drop(2), take(2));

    expect(mapper).toHaveBeenCalledTimes(4);
  });
});
