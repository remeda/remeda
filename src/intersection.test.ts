import { identity } from "./identity";
import { intersection } from "./intersection";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data_first", () => {
  test("intersection", () => {
    expect(intersection([1, 2, 3] as const, [2, 3, 5] as const)).toEqual([
      2, 3,
    ]);
  });
});

describe("data_last", () => {
  test("intersection", () => {
    expect(intersection([2, 3, 5] as const)([1, 2, 3] as const)).toEqual([
      2, 3,
    ]);
  });
});

describe("multiset", () => {
  describe("runtime", () => {
    it("returns empty array trivially", () => {
      expect(intersection.multiset([], [])).toStrictEqual([]);
    });

    it("returns empty array on empty input", () => {
      expect(intersection.multiset([], [1, 2, 3])).toStrictEqual([]);
      expect(intersection.multiset([1, 2, 3], [])).toStrictEqual([]);
    });

    it("returns empty array on disjoint arrays", () => {
      expect(intersection.multiset([1], [2])).toStrictEqual([]);
    });

    it("works trivially on a single item", () => {
      expect(intersection.multiset([1], [1])).toStrictEqual([1]);
    });

    it("maintains multi-set semantics (returns only one copy)", () => {
      expect(intersection.multiset([1, 1], [1])).toStrictEqual([1]);
      expect(intersection.multiset([1], [1, 1])).toStrictEqual([1]);
    });

    it("maintains multi-set semantics (returns as many copies as available)", () => {
      expect(intersection.multiset([1, 1, 1, 1, 1], [1, 1])).toStrictEqual([
        1, 1,
      ]);
      expect(intersection.multiset([1, 1], [1, 1, 1, 1, 1])).toStrictEqual([
        1, 1,
      ]);
    });

    it("preserves the original order in source array", () => {
      expect(intersection.multiset([3, 2, 1], [1, 2, 3])).toStrictEqual([
        3, 2, 1,
      ]);
    });

    it("maintains order for multiple copies", () => {
      expect(
        intersection.multiset([3, 2, 2, 2, 2, 2, 1], [1, 2, 3]),
      ).toStrictEqual([3, 2, 1]);
    });

    it("returns a shallow copy even when all items match", () => {
      const data = [1, 2, 3];
      const result = intersection.multiset(data, [1, 2, 3]);
      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });
  });

  describe("piping", () => {
    test("lazy", () => {
      const mock = vi.fn(identity);
      const result = pipe(
        [1, 2, 3, 4, 5, 6],
        map(mock),
        intersection.multiset([4, 2]),
        take(2),
      );
      expect(mock).toHaveBeenCalledTimes(4);
      expect(result).toStrictEqual([2, 4]);
    });
  });

  describe("typing", () => {
    it("narrows the result type", () => {
      const result = intersection.multiset(
        [1, 2, 3, "a", "b"],
        ["a", "b", true, false],
      );
      expectTypeOf(result).toEqualTypeOf<Array<string>>();
    });
  });
});
