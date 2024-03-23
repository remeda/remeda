import { identity } from "./identity";
import { pipe } from "./pipe";
import { takeFirstBy } from "./takeFirstBy";

describe("runtime (dataFirst)", () => {
  it("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(takeFirstBy(data, 2, identity())).toEqual([2, 1]);
  });

  it("handles empty arrays gracefully", () => {
    const data: Array<number> = [];
    expect(takeFirstBy(data, 1, identity())).toHaveLength(0);
  });

  it("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(takeFirstBy(data, -3, identity())).toHaveLength(0);
  });

  it("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(takeFirstBy(data, 100, identity())).toHaveLength(data.length);
  });

  it("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = takeFirstBy(data, 100, identity());
    expect(result).not.toBe(data);
    expect(result).toEqual(data);
  });

  it("works with complex compare rules", () => {
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
    expect(takeFirstBy(data, 3, (x) => x.length, identity())).toEqual([
      "aa",
      "b",
      "a",
    ]);
  });
});

describe("runtime (dataLast)", () => {
  it("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        takeFirstBy(2, (x) => x),
      ),
    ).toEqual([2, 1]);
  });

  it("handles empty arrays gracefully", () => {
    const data: Array<number> = [];
    expect(
      pipe(
        data,
        takeFirstBy(1, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        takeFirstBy(-3, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        takeFirstBy(100, (x) => x),
      ),
    ).toHaveLength(data.length);
  });

  it("clones the array when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      takeFirstBy(100, (x) => x),
    );
    expect(result).not.toBe(data);
    expect(result).toEqual(data);
  });

  it("works with complex compare rules", () => {
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
    ).toEqual(["aa", "b", "a"]);
  });
});
