import { sortedLastIndex } from "./sortedLastIndex";

describe("runtime correctness", () => {
  test("empty array", () => {
    expect(sortedLastIndex([], 1)).toBe(0);
  });

  describe("array with single item", () => {
    test("item smaller than item in array", () => {
      expect(sortedLastIndex([2], 1)).toBe(0);
    });

    test("item larger than item in array", () => {
      expect(sortedLastIndex([0], 1)).toBe(1);
    });

    test("item in array", () => {
      expect(sortedLastIndex([1], 1)).toBe(1);
    });
  });

  describe("array with multiple values", () => {
    test("item smaller than all items in array", () => {
      expect(sortedLastIndex([1, 2, 3, 4, 5], 0)).toBe(0);
    });

    test("item larger than all items in array", () => {
      expect(sortedLastIndex([1, 2, 3, 4, 5], 6)).toBe(5);
    });

    test("item in array", () => {
      expect(sortedLastIndex([1, 2, 3, 4, 5], 3)).toBe(3);
    });
  });

  describe("array with duplicates", () => {
    test("item smaller than all items in array", () => {
      expect(sortedLastIndex([1, 1, 1, 1, 1], 0)).toBe(0);
    });

    test("item larger than all items in array", () => {
      expect(sortedLastIndex([1, 1, 1, 1, 1], 2)).toBe(5);
    });

    test("item in array", () => {
      expect(sortedLastIndex([1, 1, 1, 1, 1], 1)).toBe(5);
    });
  });

  describe("string array", () => {
    test("item smaller than all items in array", () => {
      expect(sortedLastIndex(["a", "b", "c", "d", "e"], " ")).toBe(0);
    });

    test("item larger than all items in array", () => {
      expect(sortedLastIndex(["a", "b", "c", "d", "e"], "z")).toBe(5);
    });

    test("item in array", () => {
      expect(sortedLastIndex(["a", "b", "c", "d", "e"], "c")).toBe(3);
    });
  });
});
