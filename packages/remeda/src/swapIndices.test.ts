import { describe, expect, test } from "vitest";
import { swapIndices } from "./swapIndices";

describe("data_first", () => {
  test("swap array", () => {
    expect(swapIndices([1, 2, 3, 4, 5], 0, -1)).toStrictEqual([5, 2, 3, 4, 1]);
  });

  test("swap string", () => {
    expect(swapIndices("apple", 0, 1)).toBe("paple");
  });

  test("fails gracefully on NaN indices", () => {
    expect(swapIndices("apple", Number.NaN, 1)).toBe("apple");
    expect(swapIndices("apple", 1, Number.NaN)).toBe("apple");
    expect(swapIndices("apple", Number.NaN, Number.NaN)).toBe("apple");
  });

  test("fails gracefully on overflow indices", () => {
    expect(swapIndices("apple", 100, 1)).toBe("apple");
    expect(swapIndices("apple", 1, 100)).toBe("apple");
    expect(swapIndices("apple", 200, 300)).toBe("apple");
  });
});

describe("data_last", () => {
  test("swap array", () => {
    expect(swapIndices(-1, 4)([1, 2, 3, 4, 5])).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("swap string", () => {
    expect(swapIndices(0, -1)("apple")).toBe("eppla");
  });
});
