import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
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
});
