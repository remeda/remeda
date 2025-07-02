import { describe, expect, test } from "vitest";
import { identity } from "./identity";
import { rankBy } from "./rankBy";

describe("runtime (dataFirst)", () => {
  test("works trivially with empty arrays", () => {
    expect(rankBy([], 1, identity)).toBe(0);
  });

  test("maintains the rank for items already in the array", () => {
    const data = [5, 1, 3] as const;
    const sorted = [...data].sort((a, b) => a - b);
    for (const [index, item] of sorted.entries()) {
      expect(rankBy(data, item, identity())).toBe(index);
    }
  });

  test("can rank items not in the array", () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(data, 0, identity())).toBe(0);
    expect(rankBy(data, 2, identity())).toBe(1);
    expect(rankBy(data, 4, identity())).toBe(2);
  });

  test("finds items ranked at the end of the array", () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(data, 6, identity())).toBe(3);
  });
});
