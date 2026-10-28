import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { zipWith } from "./zipWith";

describe("data first", () => {
  test("should zip with predicate", () => {
    expect(
      zipWith(["1", "2", "3"], ["a", "b", "c"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      zipWith(["1", "2", "3"], ["a", "b"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      zipWith(["1", "2"], ["a", "b", "c"], (a, b) => `${a}${b}`),
    ).toStrictEqual(["1a", "2b"]);
  });
});

describe("data second", () => {
  test("should zip with predicate", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2", "3"],
        ["a", "b", "c"],
      ),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2", "3"],
        ["a", "b"],
      ),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      zipWith((a: string, b: string) => `${a}${b}`)(
        ["1", "2"],
        ["a", "b", "c"],
      ),
    ).toStrictEqual(["1a", "2b"]);
  });
});

describe("data second with initial arg", () => {
  test("should zip with predicate", () => {
    expect(
      pipe(
        ["1", "2", "3"],
        zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b", "3c"]);
  });

  test("should truncate to shorter second", () => {
    expect(
      pipe(
        ["1", "2", "3"],
        zipWith(["a", "b"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should truncate to shorter first", () => {
    expect(
      pipe(
        ["1", "2"],
        zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual(["1a", "2b"]);
  });

  test("should return empty when second is empty", () => {
    const mockFn = vi.fn<(a: string, b: string) => string>();

    expect(pipe(["1", "2"], zipWith([], mockFn))).toStrictEqual([]);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test("lazily returns empty when second is empty", () => {
    const mockFn = vi.fn<(a: string, b: string) => string>();

    expect(
      pipe(["1", "2"], map(identity()), zipWith([], mockFn)),
    ).toStrictEqual([]);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test("provides the first items processed so far", () => {
    const other = ["a", "b", "c"];
    const zipper = vi.fn<
      (
        first: unknown,
        second: unknown,
        index: unknown,
        data: readonly [readonly unknown[], readonly unknown[]],
      ) => unknown
    >((_first, _second, _index, data) => structuredClone(data));
    pipe([1, 2, 3], forceFusion(), zipWith(other, zipper));

    expect(zipper).toHaveNthReturnedWith(1, [[1], other]);
    expect(zipper).toHaveNthReturnedWith(2, [[1, 2], other]);
    expect(zipper).toHaveNthReturnedWith(3, [[1, 2, 3], other]);
  });

  test("doesn't collect the first items processed so far for a zipper without `data`", () => {
    const zipper = vi.fn<
      (
        first: number,
        second: string,
        index: number,
        data: readonly [readonly number[], readonly string[]],
      ) => string
    >((first, second, index) => `${first}${second}${index}`);
    pipe([1, 2, 3], forceFusion(), zipWith(["a", "b", "c"], zipper));

    expect(() => zipper.mock.calls[0]?.[3]?.[0]?.at(0)).toThrow(/^Remeda: /u);
  });

  test("should return empty when first is empty", () => {
    expect(
      pipe(
        [],
        zipWith(["a", "b"], (a, b) => `${a}${b}`),
      ),
    ).toStrictEqual([]);
  });

  test("pairs by the step's own count after an upstream filter", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5, 6],
        filter((x) => x % 2 === 0),
        zipWith(["a", "b", "c"], (n, s) => `${n}${s}`),
      ),
    ).toStrictEqual(["2a", "4b", "6c"]);
  });
});
