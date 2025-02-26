import { chunk } from "./chunk";

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
});

describe("data last", () => {
  test("equal size", () => {
    expect(chunk(2)(["a", "b", "c", "d"])).toStrictEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});

describe("edge-cases", () => {
  it("throws on 0 size", () => {
    expect(() => chunk(["a", "b", "c", "d"], 0)).toThrow(
      "chunk: A chunk size of '0' would result in an infinite array",
    );
  });

  it("throws on negative size", () => {
    expect(() => chunk(["a", "b", "c", "d"], -10)).toThrow(
      "chunk: A chunk size of '-10' would result in an infinite array",
    );
  });

  test("size > data.length", () => {
    const data = [1, 2, 3] as const;
    const result = chunk(data, 10);

    expect(result).toStrictEqual([data]);
    // We expect the result to be a shallow clone
    expect(result[0]).not.toBe(data);
  });

  test("chunk of size 1", () => {
    const data = [1, 2, 3, 4, 5] as const;
    const result = chunk(data, 1);

    expect(result).toStrictEqual([[1], [2], [3], [4], [5]]);
  });
});
