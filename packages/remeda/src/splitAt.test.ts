import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { splitAt } from "./splitAt";

describe("data_first", () => {
  test("split", () => {
    expect(splitAt([1, 2, 3] as const, 1)).toStrictEqual([[1], [2, 3]]);
  });

  test("split at -1", () => {
    expect(splitAt([1, 2, 3, 4, 5] as const, -1)).toStrictEqual([
      [1, 2, 3, 4],
      [5],
    ]);
  });

  test("empty array", () => {
    expect(splitAt([], 1)).toStrictEqual([[], []]);
  });

  test("single item", () => {
    expect(splitAt([1], 1)).toStrictEqual([[1], []]);
  });

  test("index 0", () => {
    expect(splitAt([1, 2, 3], 0)).toStrictEqual([[], [1, 2, 3]]);
  });

  test("index -0", () => {
    expect(splitAt([1, 2, 3], -0)).toStrictEqual([[], [1, 2, 3]]);
  });

  test("fractional index truncates", () => {
    expect(splitAt([1, 2, 3], 1.5)).toStrictEqual([[1], [2, 3]]);
  });

  test("negative fractional index counts from the end before truncating", () => {
    expect(splitAt([1, 2, 3, 4, 5], -1.5)).toStrictEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  test("index NaN", () => {
    expect(splitAt([1, 2, 3], NaN)).toStrictEqual([[], [1, 2, 3]]);
  });

  test("index at the length", () => {
    expect(splitAt([1, 2, 3], 3)).toStrictEqual([[1, 2, 3], []]);
  });

  test("index past the length is clamped", () => {
    expect(splitAt([1, 2, 3], 5)).toStrictEqual([[1, 2, 3], []]);
  });

  test("negative index past the length is clamped", () => {
    expect(splitAt([1, 2, 3], -5)).toStrictEqual([[], [1, 2, 3]]);
  });

  test("index Infinity", () => {
    expect(splitAt([1, 2, 3], Infinity)).toStrictEqual([[1, 2, 3], []]);
  });

  test("index -Infinity", () => {
    expect(splitAt([1, 2, 3], -Infinity)).toStrictEqual([[], [1, 2, 3]]);
  });

  test("holes are kept", () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
    expect(splitAt([1, , 3], 1)).toStrictEqual([[1], [, 3]]);
  });
});

describe("data_last", () => {
  test("split", () => {
    expect(splitAt(1)([1, 2, 3] as const)).toStrictEqual([[1], [2, 3]]);
  });

  test("split at -1", () => {
    expect(splitAt(-1)([1, 2, 3, 4, 5] as const)).toStrictEqual([
      [1, 2, 3, 4],
      [5],
    ]);
  });

  test("empty array", () => {
    expect(pipe([], splitAt(1))).toStrictEqual([[], []]);
  });

  test("holes are kept", () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the input under test.
    expect(pipe([1, , 3], splitAt(1))).toStrictEqual([[1], [, 3]]);
  });
});
