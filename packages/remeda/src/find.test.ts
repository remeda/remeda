import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { find } from "./find";
import { identity } from "./identity";
import { isStrictEqual } from "./isStrictEqual";
import { map } from "./map";
import { pipe } from "./pipe";

describe("data first", () => {
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ b }) => b === 2,
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("indexed", () => {
    expect(
      find(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ b }, idx) => b === 2 && idx === 1,
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });
});

describe("data last", () => {
  test("find", () => {
    const data = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 3 },
    ] as const;

    const counter =
      vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

    const actual = pipe(
      data,
      map(counter),
      find(({ b }) => b === 2),
    );

    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });

  test("indexed", () => {
    const data = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 3 },
    ] as const;

    const counter =
      vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

    const actual = pipe(
      data,
      map(counter),
      find(({ b }, idx) => b === 2 && idx === 1),
    );

    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });

  test("not found", () => {
    expect(
      pipe(
        [1, 2, 3],
        find((x) => x > 3),
      ),
    ).toBeUndefined();
  });

  test("not found after a lazy step", () => {
    expect(
      pipe(
        [1, 2, 3],
        map((x) => x * 2),
        find((x) => x > 6),
      ),
    ).toBeUndefined();
  });

  test("empty array", () => {
    expect(
      pipe(
        [] as number[],
        find((x) => x > 3),
      ),
    ).toBeUndefined();
  });

  test("empty array after a lazy step", () => {
    expect(
      pipe(
        [] as number[],
        map((x) => x * 2),
        find((x) => x > 6),
      ),
    ).toBeUndefined();
  });

  test("provides the items processed so far to the predicate", () => {
    const dataSnapshots: number[][] = [];
    pipe(
      [1, 2, 3],
      forceFusion(),
      find((_value, _index, data) => {
        dataSnapshots.push([...data]);
        return false;
      }),
    );

    expect(dataSnapshots).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
  });

  test("doesn't collect the items processed so far for a predicate without `data`", () => {
    const predicate = vi.fn<
      (value: number, index: number, data: readonly number[]) => boolean
    >((value, index) => value > index);
    pipe([1, 2, 3], forceFusion(), find(predicate));

    expect(() => predicate.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
  });

  test("a lone step stops calling the predicate at the first match", () => {
    const predicate = vi.fn<(x: number) => boolean>(isStrictEqual(2));
    pipe([1, 2, 3], find(predicate));

    expect(predicate).toHaveBeenCalledTimes(2);
  });
});
