import { dropFirstBy } from "./dropFirstBy";
import { identity } from "./identity";
import { pipe } from "./pipe";

describe("runtime (dataFirst)", () => {
  it("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, 2, identity())).toStrictEqual([5, 6, 4, 3, 7]);
  });

  it("handles empty arrays gracefully", () => {
    const data: Array<number> = [];

    expect(dropFirstBy(data, 1, identity())).toHaveLength(0);
  });

  it("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, -3, identity())).toHaveLength(data.length);
  });

  it("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(dropFirstBy(data, 100, identity())).toHaveLength(0);
  });

  it("clones the input when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = dropFirstBy(data, 0, identity());

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
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

    expect(dropFirstBy(data, 3, (x) => x.length, identity())).toStrictEqual([
      "bbbbb",
      "aaa",
      "bbb",
      "bbbb",
      "aaaa",
      "bb",
      "aaaaa",
    ]);
  });
});

describe("runtime (dataLast)", () => {
  it("works", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        dropFirstBy(2, (x) => x),
      ),
    ).toStrictEqual([5, 6, 4, 3, 7]);
  });

  it("handles empty arrays gracefully", () => {
    const data: Array<number> = [];

    expect(
      pipe(
        data,
        dropFirstBy(1, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it("handles negative numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        dropFirstBy(-3, (x) => x),
      ),
    ).toHaveLength(data.length);
  });

  it("handles overflowing numbers gracefully", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];

    expect(
      pipe(
        data,
        dropFirstBy(100, (x) => x),
      ),
    ).toHaveLength(0);
  });

  it("clones the data when needed", () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      dropFirstBy(0, (x) => x),
    );

    expect(result).not.toBe(data);
    expect(result).toStrictEqual(data);
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
        dropFirstBy(
          3,
          (x) => x.length,
          (x) => x,
        ),
      ),
    ).toStrictEqual(["bbbbb", "aaa", "bbb", "bbbb", "aaaa", "bb", "aaaaa"]);
  });
});
