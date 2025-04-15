import { chunk } from "./chunk";
import { describeWithPipe } from "./internal/describeWithPipe";

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

describeWithPipe("data last", (pipe) => {
  test("equal size", () => {
    expect(pipe(["a", "b", "c", "d"], chunk(2))).toStrictEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  test("not equal size", () => {
    expect(pipe(["a", "b", "c", "d"], chunk(3))).toStrictEqual([
      ["a", "b", "c"],
      ["d"],
    ]);
  });

  test("1 element", () => {
    expect(pipe(["x"], chunk(3))).toStrictEqual([["x"]]);
  });

  test("empty array", () => {
    expect(pipe([], chunk(3))).toStrictEqual([]);
  });
});

describeWithPipe("edge-cases", (pipe) => {
  it("throws on 0 size", () => {
    expect(() => pipe(["a", "b", "c", "d"], chunk(0))).toThrow(
      "chunk: A chunk size of '0' would result in an infinite array",
    );
  });

  it("throws on negative size", () => {
    expect(() => pipe(["a", "b", "c", "d"], chunk(-10))).toThrow(
      "chunk: A chunk size of '-10' would result in an infinite array",
    );
  });

  test("size > data.length", () => {
    const data = [1, 2, 3] as const;
    const result = pipe(data, chunk(10));

    expect(result).toStrictEqual([data]);
    // We expect the result to be a shallow clone
    expect(result[0]).not.toBe(data);
  });

  test("chunk of size 1", () => {
    const data = [1, 2, 3, 4, 5] as const;
    const result = pipe(data, chunk(1));

    expect(result).toStrictEqual([[1], [2], [3], [4], [5]]);
  });
});
