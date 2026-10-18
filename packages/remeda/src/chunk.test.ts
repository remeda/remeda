import { describe, expect, test } from "vitest";
import { chunk } from "./chunk";
import { filter } from "./filter";
import { pipe } from "./pipe";
import { range } from "./range";
import { take } from "./take";

describe("data first", () => {
  test("equal size", () => {
    expect(chunk(["a", "b", "c", "d"], 2)).toStrictEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("not equal size", () => {
    expect(chunk(["a", "b", "c", "d"], 3)).toStrictEqual([
      ["a", "b", "c"],
      ["d"],
    ]);
  });

  test("1 element", () => {
    expect(chunk(["x"], 3)).toStrictEqual([["x"]]);
  });

  test("empty array", () => {
    expect(chunk([], 3)).toStrictEqual([]);
  });

  test("keeps NaN and -0", () => {
    expect(chunk([NaN, -0, 0], 2)).toStrictEqual([[NaN, -0], [0]]);
  });
});

describe("data last", () => {
  test("equal size", () => {
    expect(chunk(2)(["a", "b", "c", "d"])).toStrictEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("empty array", () => {
    expect(pipe([], chunk(2))).toStrictEqual([]);
  });

  test("a partial last chunk", () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2))).toStrictEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  test("size equal to the length", () => {
    expect(pipe([1, 2, 3], chunk(3))).toStrictEqual([[1, 2, 3]]);
  });

  test("infinite size", () => {
    expect(pipe([1, 2, 3], chunk(Infinity))).toStrictEqual([[1, 2, 3]]);
  });

  test("throws on a size under 1 even on an empty array", () => {
    expect(() => pipe([], chunk(0))).toThrow(
      new RangeError(
        "chunk: A chunk size of '0' would result in an infinite array",
      ),
    );
  });

  test("a NaN size on an empty array", () => {
    expect(pipe([], chunk(NaN))).toStrictEqual([]);
  });

  test("throws on a NaN size", () => {
    expect(() => pipe([1], chunk(NaN))).toThrow(
      new RangeError("Invalid array length"),
    );
  });

  test("keeps holes across chunks", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    const data = [1, , 3, 4];
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    const firstChunk = [1, ,];

    expect(pipe(data, chunk(2))).toStrictEqual([firstChunk, [3, 4]]);
  });

  test("chunks only the items that reach it", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        filter((x) => x % 2 === 1),
        chunk(2),
      ),
    ).toStrictEqual([[1, 3], [5]]);
  });

  test("before a stopper that ends on the partial last chunk", () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2), take(3))).toStrictEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  test("before a stopper that ends before the partial last chunk", () => {
    expect(pipe([1, 2, 3, 4, 5], chunk(2), take(2))).toStrictEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  // The sizes are typed as plain `number`: in a pipe, the literal-size result
  // types recurse past TypeScript's depth limit for some fractional literals
  // (TS2589).
  describe("fractional sizes", () => {
    test("cut at multiples of the size", () => {
      expect(pipe(range(0, 10), chunk<number>(2.5))).toStrictEqual([
        [0, 1],
        [2, 3, 4],
        [5, 6],
        [7, 8, 9],
      ]);
    });

    test("float rounding can drop an item", () => {
      expect(pipe(range(0, 12), chunk<number>(1.2))).toStrictEqual([
        [0],
        [1],
        [2],
        [3],
        [4, 5],
        [6],
        [7],
        [8],
        [9],
        [10],
      ]);
    });

    test("float rounding can end with an empty chunk", () => {
      expect(pipe(range(0, 21), chunk<number>(1.4)).slice(-3)).toStrictEqual([
        [18],
        [19],
        [],
      ]);
    });

    test("float rounding can repeat an item", () => {
      expect(pipe(range(0, 58), chunk<number>(2.28)).slice(-2)).toStrictEqual([
        [54, 55, 56],
        [56, 57],
      ]);
    });
  });
});

describe("edge-cases", () => {
  test("throws on 0 size", () => {
    expect(() => chunk(["a", "b", "c", "d"], 0)).toThrow(
      new RangeError(
        "chunk: A chunk size of '0' would result in an infinite array",
      ),
    );
  });

  test("throws on negative size", () => {
    expect(() => chunk(["a", "b", "c", "d"], -10)).toThrow(
      new RangeError(
        "chunk: A chunk size of '-10' would result in an infinite array",
      ),
    );
  });

  test("throws on a fractional size under 1", () => {
    expect(() => chunk(["a", "b", "c", "d"], 0.5)).toThrow(
      new RangeError(
        "chunk: A chunk size of '0.5' would result in an infinite array",
      ),
    );
  });

  test("throws on -Infinity size", () => {
    expect(() => chunk(["a", "b", "c", "d"], -Infinity)).toThrow(
      new RangeError(
        "chunk: A chunk size of '-Infinity' would result in an infinite array",
      ),
    );
  });

  test("throws on a size under 1 even on an empty array", () => {
    expect(() => chunk([], 0)).toThrow(
      new RangeError(
        "chunk: A chunk size of '0' would result in an infinite array",
      ),
    );
  });

  test("throws on a NaN size", () => {
    expect(() => chunk(["a", "b", "c", "d"], NaN)).toThrow(
      new RangeError("Invalid array length"),
    );
  });

  test("a NaN size on an empty array", () => {
    expect(chunk([], NaN)).toStrictEqual([]);
  });

  test("size > data.length", () => {
    const data = [1, 2, 3] as const;
    const result = chunk(data, 10);

    expect(result).toStrictEqual([data]);
    // We expect the result to be a shallow clone
    expect(result[0]).not.toBe(data);
  });

  test("size equal to data.length", () => {
    expect(chunk([1, 2, 3], 3)).toStrictEqual([[1, 2, 3]]);
  });

  test("infinite size", () => {
    expect(chunk([1, 2, 3], Infinity)).toStrictEqual([[1, 2, 3]]);
  });

  test("chunk of size 1", () => {
    const data = [1, 2, 3, 4, 5] as const;
    const result = chunk(data, 1);

    expect(result).toStrictEqual([[1], [2], [3], [4], [5]]);
  });

  describe("holes", () => {
    test("kept across chunks", () => {
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      const data = [1, , 3, 4];
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      const firstChunk = [1, ,];

      expect(chunk(data, 2)).toStrictEqual([firstChunk, [3, 4]]);
    });

    test("filled in a single chunk", () => {
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      expect(chunk([1, , 3], 3)).toStrictEqual([[1, undefined, 3]]);
    });

    test("filled in chunks of size 1", () => {
      // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
      expect(chunk([1, , 3], 1)).toStrictEqual([[1], [undefined], [3]]);
    });
  });

  // The sizes are typed as plain `number`: the literal-size result types
  // recurse past TypeScript's depth limit for some fractional literals
  // (TS2589).
  describe("fractional sizes", () => {
    test("cut at multiples of the size", () => {
      expect(chunk<number[], number>(range(0, 10), 2.5)).toStrictEqual([
        [0, 1],
        [2, 3, 4],
        [5, 6],
        [7, 8, 9],
      ]);
    });

    test("between 1 and 2", () => {
      expect(chunk<number[], number>(range(0, 4), 1.5)).toStrictEqual([
        [0],
        [1, 2],
        [3],
      ]);
    });

    // Chunk `k` ends at `k * size + size` but chunk `k + 1` starts at
    // `(k + 1) * size`, and in floating point the two can truncate to
    // different integers. The chunk count, `Math.ceil(length / size)`, can
    // round up too.
    test("float rounding can drop an item", () => {
      expect(chunk<number[], number>(range(0, 12), 1.2)).toStrictEqual([
        [0],
        [1],
        [2],
        [3],
        [4, 5],
        [6],
        [7],
        [8],
        [9],
        [10],
      ]);
    });

    test("float rounding can end with an empty chunk", () => {
      expect(
        chunk<number[], number>(range(0, 21), 1.4).slice(-3),
      ).toStrictEqual([[18], [19], []]);
    });

    test("float rounding can repeat an item", () => {
      expect(
        chunk<number[], number>(range(0, 58), 2.28).slice(-2),
      ).toStrictEqual([
        [54, 55, 56],
        [56, 57],
      ]);
    });
  });
});
