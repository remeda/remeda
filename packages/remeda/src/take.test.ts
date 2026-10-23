import { describe, expect, test, vi } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data first", () => {
  test("works on regular inputs", () => {
    expect(take([1, 2, 3, 4, 5], 2)).toStrictEqual([1, 2]);
  });

  test("works trivially on empty arrays", () => {
    expect(take([], 2)).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(take([1, 2, 3, 4, 5], -1)).toStrictEqual([]);
  });

  test("works when taking more than the length of the array", () => {
    expect(take([1, 2, 3, 4, 5], 10)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("returns a shallow clone when all items are taken", () => {
    const data = [1, 2, 3, 4, 5];
    const result = take(data, 5);

    expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(data);
  });
});

describe("data last", () => {
  test("works on regular inputs", () => {
    expect(pipe([1, 2, 3, 4, 5], take(2))).toStrictEqual([1, 2]);
  });

  test("works trivially on empty arrays", () => {
    expect(pipe([], take(2))).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(pipe([1, 2, 3, 4, 5], take(-1))).toStrictEqual([]);
  });

  test("works when taking more than the length of the array", () => {
    expect(pipe([1, 2, 3, 4, 5], take(10))).toStrictEqual([1, 2, 3, 4, 5]);
  });

  // https://github.com/remeda/remeda/pull/1469
  test.each([
    [2.5, [1, 2]],
    [1.5, [1]],
    [0.5, []],
  ])("truncates a count of %s", (n, expected) => {
    expect(pipe([1, 2, 3, 4, 5], take(n))).toStrictEqual(expected);
  });

  test.each([
    [2.5, [1, 2]],
    [1.5, [1]],
    [0.5, []],
  ])("truncates a count of %s in a fused run", (n, expected) => {
    expect(pipe([1, 2, 3, 4, 5], map(identity()), take(n))).toStrictEqual(
      expected,
    );
  });

  test("reads a NaN count as 0", () => {
    expect(pipe([1, 2, 3, 4, 5], take(NaN))).toStrictEqual([]);
  });

  test("reads a NaN count as 0 in a fused run", () => {
    expect(pipe([1, 2, 3, 4, 5], map(identity()), take(NaN))).toStrictEqual([]);
  });

  test("lazy implementation", () => {
    const mockFunc = vi.fn<(x: number) => number>();
    pipe([1, 2, 3, 4, 5], map(mockFunc), take(2));

    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  test("lazy implementation with a fractional count", () => {
    const mockFunc = vi.fn<(x: number) => number>();
    pipe([1, 2, 3, 4, 5], map(mockFunc), take(2.5));

    expect(mockFunc).toHaveBeenCalledTimes(2);
  });
});
