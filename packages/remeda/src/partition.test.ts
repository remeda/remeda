import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { isDefined } from "./isDefined";
import { isNumber } from "./isNumber";
import { partition } from "./partition";
import { pipe } from "./pipe";

describe("data first", () => {
  test("partition", () => {
    expect(
      partition(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ a }) => a === 1,
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });

  test("partition with type guard", () => {
    expect(partition([1, "a", 2, "b"], isNumber)).toStrictEqual([
      [1, 2],
      ["a", "b"],
    ]);
  });

  test("partition with type guard in pipe", () => {
    expect(
      pipe(
        [1, "a", 2, "b"],
        partition((value): value is number => typeof value === "number"),
      ),
    ).toStrictEqual([
      [1, 2],
      ["a", "b"],
    ]);
  });

  test("indexed", () => {
    expect(
      partition(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        (_, index) => index !== 2,
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });

  test("empty array", () => {
    expect(partition([], constant(true))).toStrictEqual([[], []]);
  });

  test("single item", () => {
    expect(partition(["a"], constant(true))).toStrictEqual([["a"], []]);
  });

  test("holes are partitioned as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
    expect(partition([1, , 3], isDefined)).toStrictEqual([[1, 3], [undefined]]);
  });

  test("calls the predicate once per item, in order, with the whole input", () => {
    const data = ["a", "b", "c"];
    const predicate = vi.fn<
      (value: string, index: number, data: readonly string[]) => boolean
    >(constant(true));

    partition(data, predicate);

    expect(predicate.mock.calls).toStrictEqual([
      ["a", 0, data],
      ["b", 1, data],
      ["c", 2, data],
    ]);
  });
});

describe("data last", () => {
  test("partition", () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        partition(({ a }) => a === 1),
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });

  test("indexed", () => {
    expect(
      pipe(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        partition((_, index) => index !== 2),
      ),
    ).toStrictEqual([
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      [{ a: 2, b: 1 }],
    ]);
  });

  test("empty array", () => {
    expect(pipe([], partition(constant(true)))).toStrictEqual([[], []]);
  });
});
