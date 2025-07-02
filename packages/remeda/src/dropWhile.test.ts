import { describe, expect, test } from "vitest";
import { dropWhile } from "./dropWhile";
import { pipe } from "./pipe";

describe("data first", () => {
  test("should return items starting from the first predicate failure", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n !== 3)).toStrictEqual([3, 4]);
  });

  test("should return an empty array when all items pass the predicate", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n > 0)).toStrictEqual([]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(dropWhile([], (n) => n > 0)).toStrictEqual([]);
  });

  test("should return last item when last item fails the predicate", () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n !== 4)).toStrictEqual([4]);
  });

  test("should return a copy of the array when the first item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = dropWhile(data, (n) => n !== 1);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });
});

describe("data last", () => {
  test("should return items starting from the first predicate failure", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n !== 3),
      ),
    ).toStrictEqual([3, 4]);
  });

  test("should return an empty array when all items pass the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("should return an empty array when an empty array is passed", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  test("should return last item when last item fails the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropWhile((n) => n !== 4),
      ),
    ).toStrictEqual([4]);
  });

  test("should return a copy of the array when the first item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = pipe(
      data,
      dropWhile((n) => n !== 1),
    );

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });
});
