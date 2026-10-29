import { describe, expect, test, vi } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { defaultTo } from "./defaultTo";
import { dropFirstBy } from "./dropFirstBy";
import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { piped } from "./piped";
import { prop } from "./prop";
import { take } from "./take";

describe("runtime (dataFirst)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, 2, identity())).toStrictEqual([5, 6, 4, 3, 7]);
  });

  test("handles empty arrays gracefully", () => {
    const data: number[] = [];

    expect(dropFirstBy(data, 1, identity())).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, -3, identity())).toHaveLength(data.length);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, 100, identity())).toHaveLength(0);
  });

  test("clones the input when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = dropFirstBy(data, 0, identity());

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

    expect(dropFirstBy(data, 3, prop("length"), identity())).toStrictEqual([
      "bbbbb",
      "aaa",
      "bbb",
      "bbbb",
      "aaaa",
      "bb",
      "aaaaa",
    ]);
  });

  test("keeps a null item from the first n", () => {
    expect(dropFirstBy([null, -1], 1, defaultTo(0))).toStrictEqual([null]);
  });

  test("keeps an undefined item from the first n", () => {
    expect(dropFirstBy([undefined, -1], 1, defaultTo(0))).toStrictEqual([
      undefined,
    ]);
  });

  test("keeps every nullish item from the first n", () => {
    expect(
      dropFirstBy([null, null, 1, 2], 2, defaultTo(Infinity)),
    ).toStrictEqual([null, null]);
  });

  test.each([
    [0, [1, 2, 3, 4, 5]],
    [-1, [1, 2, 3, 4, 5]],
    [-Infinity, [1, 2, 3, 4, 5]],
    [NaN, [1, 2, 3, 4, 5]],
    [2, [3, 4, 5]],
    [0.5, [1, 2, 3, 4, 5]],
    [2.5, [3, 4, 5]],
    [5, []],
    [10, []],
    [Infinity, []],
  ])("count %s", (n, expected) => {
    expect(dropFirstBy([1, 2, 3, 4, 5], n, identity())).toStrictEqual(expected);
  });

  test("breaks ties by the shape of the heap", () => {
    expect(
      dropFirstBy(
        [
          { id: "a", key: 0 },
          { id: "b", key: 0 },
          { id: "c", key: 1 },
          { id: "d", key: 1 },
          { id: "e", key: 0 },
        ],
        4,
        prop("key"),
      ),
    ).toStrictEqual([{ id: "d", key: 1 }]);
  });

  test("works with a descending order rule", () => {
    expect(dropFirstBy([5, 1, 3], 2, [identity(), "desc"])).toStrictEqual([1]);
  });
});

describe("runtime (dataLast)", () => {
  test("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(pipe(data, dropFirstBy(2, identity()))).toStrictEqual([
      5, 6, 4, 3, 7,
    ]);
  });

  test("handles empty arrays gracefully", () => {
    const data: number[] = [];

    expect(pipe(data, dropFirstBy(1, identity()))).toHaveLength(0);
  });

  test("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(pipe(data, dropFirstBy(-3, identity()))).toHaveLength(data.length);
  });

  test("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(pipe(data, dropFirstBy(100, identity()))).toHaveLength(0);
  });

  test("clones the data when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(data, dropFirstBy(0, identity()));

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
      pipe(data, dropFirstBy(3, prop("length"), identity())),
    ).toStrictEqual(["bbbbb", "aaa", "bbb", "bbbb", "aaaa", "bb", "aaaaa"]);
  });

  test("keeps a null item from the first n", () => {
    expect(pipe([null, -1], dropFirstBy(1, defaultTo(0)))).toStrictEqual([
      null,
    ]);
  });

  test("keeps an undefined item from the first n", () => {
    expect(pipe([undefined, -1], dropFirstBy(1, defaultTo(0)))).toStrictEqual([
      undefined,
    ]);
  });

  test("keeps every nullish item from the first n", () => {
    expect(
      pipe([null, null, 1, 2], dropFirstBy(2, defaultTo(Infinity))),
    ).toStrictEqual([null, null]);
  });

  test("works with a descending order rule", () => {
    expect(pipe([5, 1, 3], dropFirstBy(2, [identity(), "desc"]))).toStrictEqual(
      [1],
    );
  });

  test.each([
    [0, [1, 2, 3, 4, 5]],
    [-1, [1, 2, 3, 4, 5]],
    [-Infinity, [1, 2, 3, 4, 5]],
    [NaN, [1, 2, 3, 4, 5]],
    [2, [3, 4, 5]],
    [0.5, [1, 2, 3, 4, 5]],
    [2.5, [3, 4, 5]],
    [5, []],
    [10, []],
    [Infinity, []],
  ])("count %s in a fused run", (n, expected) => {
    expect(
      pipe([1, 2, 3, 4, 5], forceFusion(), dropFirstBy(n, identity())),
    ).toStrictEqual(expected);
  });

  test("works in a fused run", () => {
    expect(
      pipe([4, 5, 1, 6, 2, 3, 7], forceFusion(), dropFirstBy(2, identity())),
    ).toStrictEqual([5, 6, 4, 3, 7]);
  });

  test("handles empty arrays in a fused run", () => {
    expect(pipe([], forceFusion(), dropFirstBy(1, identity()))).toStrictEqual(
      [],
    );
  });

  test("works with complex compare rules in a fused run", () => {
    expect(
      pipe(
        ["a", "aaa", "bbbbb", "aa", "bb", "bbb", "bbbb", "aaaa", "b", "aaaaa"],
        forceFusion(),
        dropFirstBy(3, prop("length"), identity()),
      ),
    ).toStrictEqual(["bbbbb", "aaa", "bbb", "bbbb", "aaaa", "bb", "aaaaa"]);
  });

  test("keeps every nullish item from the first n in a fused run", () => {
    expect(
      pipe(
        [null, null, 1, 2],
        forceFusion(),
        dropFirstBy(2, defaultTo(Infinity)),
      ),
    ).toStrictEqual([null, null]);
  });

  test("breaks ties like data-first in a fused run", () => {
    const data = [
      { id: "a", key: 0 },
      { id: "b", key: 0 },
      { id: "c", key: 1 },
      { id: "d", key: 1 },
      { id: "e", key: 0 },
    ];

    expect(
      pipe(data, forceFusion(), dropFirstBy(4, prop("key"))),
    ).toStrictEqual(dropFirstBy(data, 4, prop("key")));
  });

  test("index counts the items that reached the step", () => {
    const data = [9, 4, 8, 1, 7, 2, 6, 3];

    expect(
      pipe(
        data,
        forceFusion(),
        filter((x) => x % 2 === 0),
        dropFirstBy(2, identity()),
      ),
    ).toStrictEqual(
      dropFirstBy(
        data.filter((x) => x % 2 === 0),
        2,
        identity(),
      ),
    );
  });

  test("stops pulling items once later steps are done", () => {
    const mapper = vi.fn<(x: number) => number>(identity());
    pipe([1, 2, 3, 4, 5], map(mapper), dropFirstBy(2, identity()), take(1));

    expect(mapper).toHaveBeenCalledTimes(3);
  });

  test("calls the projection like data-first in a fused run", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const dataFirstProjection = vi.fn<(x: number) => number>(identity());
    dropFirstBy(data, 2, dataFirstProjection);
    const fusedProjection = vi.fn<(x: number) => number>(identity());
    pipe(data, forceFusion(), dropFirstBy(2, fusedProjection));

    expect(fusedProjection.mock.calls).toStrictEqual(
      dataFirstProjection.mock.calls,
    );
  });

  test("doesn't call the projection when there are no more than n items", () => {
    const projection = vi.fn<(x: number) => number>(identity());
    pipe([2, 1], forceFusion(), dropFirstBy(2, projection));

    expect(projection).not.toHaveBeenCalled();
  });

  test("each pipe starts with an empty heap", () => {
    expect(
      map(
        [
          [3, 1, 2],
          [0, -1],
        ],
        piped(forceFusion(), dropFirstBy(1, identity())),
      ),
    ).toStrictEqual([[3, 2], [0]]);
  });

  test("earlier steps see the whole input", () => {
    expect(
      pipe(
        [1, 2, 3],
        map((_x, _index, { length }) => length),
        dropFirstBy(1, identity()),
      ),
    ).toStrictEqual([3, 3]);
  });
});
