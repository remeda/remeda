import { describe, expect, test } from "vitest";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { takeFirstBy } from "./takeFirstBy";

describe("runtime (dataFirst)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 2, identity())).toStrictEqual([2, 1]);
  });

  test("handles empty arrays gracefully", () => {
    const data: Array<number> = [];

    expect(takeFirstBy(data, 1, identity())).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, -3, identity())).toHaveLength(0);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(takeFirstBy(data, 100, identity())).toHaveLength(data.length);
  });

  test("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = takeFirstBy(data, 100, identity());

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  test("works with complex compare rules", () => {
    const data = [
      "a",
      "aaa",
      "bbbbb",
      "aa",
      "bb",
      "bbb",
      "bbbb",
      "aaaa",
      "b",
      "aaaaa",
    ];

    expect(takeFirstBy(data, 3, (x) => x.length, identity())).toStrictEqual([
      "aa",
      "b",
      "a",
    ]);
  });
});

describe("runtime (dataLast)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(2, (x) => x),
      ),
    ).toStrictEqual([2, 1]);
  });

  test("handles empty arrays gracefully", () => {
    const data: Array<number> = [];

    expect(
      pipe(
        data,
        takeFirstBy(1, (x) => x),
      ),
    ).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(-3, (x) => x),
      ),
    ).toHaveLength(0);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        takeFirstBy(100, (x) => x),
      ),
    ).toHaveLength(data.length);
  });

  test("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      takeFirstBy(100, (x) => x),
    );

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
  });

  test("works with complex compare rules", () => {
    const data = [
      "a",
      "aaa",
      "bbbbb",
      "aa",
      "bb",
      "bbb",
      "bbbb",
      "aaaa",
      "b",
      "aaaaa",
    ];

    expect(
      pipe(
        data,
        takeFirstBy(
          3,
          (x) => x.length,
          (x) => x,
        ),
      ),
    ).toStrictEqual(["aa", "b", "a"]);
  });
});
