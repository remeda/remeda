import { difference } from "./difference";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

const source = [1, 2, 3, 4] as const;
const other = [2, 5, 3] as const;
const expected = [1, 4] as const;

describe("data_first", () => {
  test("should return difference", () => {
    expect(difference(source, other)).toEqual(expected);
  });
});

describe("data_last", () => {
  test("should return difference", () => {
    expect(difference(other)(source)).toEqual(expected);
  });

  test("lazy", () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map((x) => {
        count();
        return x;
      }),
      difference([2, 3]),
      take(2),
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});

describe("multiset", () => {
  it("returns empty array on empty input", () => {
    expect(difference.multiset([], [1, 2, 3])).toStrictEqual([]);
  });

  it("removes nothing on empty other array", () => {
    const data = [1, 2, 3];
    const result = difference.multiset(data, []);
    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });

  it("removes an item that is in the input", () => {
    expect(difference.multiset([1], [1])).toStrictEqual([]);
  });

  it("doesnt remove items that are not in the other array", () => {
    expect(difference.multiset([1], [2])).toStrictEqual([1]);
  });

  it("maintains multi-set semantics (removes only one copy)", () => {
    expect(difference.multiset([1, 1], [1])).toStrictEqual([1]);
  });

  it("works if the other array has too many copies", () => {
    expect(difference.multiset([1], [1, 1])).toStrictEqual([]);
  });

  it("preserves the original order in source array", () => {
    expect(difference.multiset([3, 1, 2, 2], [2])).toStrictEqual([3, 1, 2]);
  });

  it("accounts and removes multiple copies", () => {
    expect(difference.multiset([1, 2, 3, 1, 2, 3], [1, 2, 1, 2])).toStrictEqual(
      [3, 3],
    );
  });

  it("works with strings", () => {
    expect(difference.multiset(["a", "b", "c"], ["b"])).toStrictEqual([
      "a",
      "c",
    ]);
  });

  it("works with objects", () => {
    const item = { a: 2 };
    expect(
      difference.multiset([item, { b: 3 }, item], [item, item]),
    ).toStrictEqual([{ b: 3 }]);
  });

  it("compares objects by reference", () => {
    expect(difference.multiset([{ a: 2 }, { b: 3 }], [{ a: 2 }])).toStrictEqual(
      [{ a: 2 }, { b: 3 }],
    );
  });
});

test("lazy", () => {
  const count = vi.fn();
  const result = pipe(
    [1, 2, 3, 4, 5, 6],
    map((x) => {
      count();
      return x;
    }),
    difference.multiset([2, 3]),
    take(2),
  );
  expect(count).toHaveBeenCalledTimes(4);
  expect(result).toEqual([1, 4]);
});
