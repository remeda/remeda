import { describe, expect, test, vi } from "vitest";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { prop } from "./prop";
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

  test("doesn't project anything for an empty array", () => {
    const projection = vi.fn<(value: number) => number>(identity());

    rankBy([], 1, projection);

    expect(projection).not.toHaveBeenCalled();
  });

  test("projects the item, then each element, in order", () => {
    const projection = vi.fn<(value: number) => number>(identity());

    rankBy([3, 1, 2], 2, projection);

    expect(projection.mock.calls).toStrictEqual([[2], [3], [2], [1], [2], [2]]);
  });

  test("doesn't count ties", () => {
    expect(rankBy([1, 1, 1], 1, identity())).toBe(0);
  });

  test("-0 ties with 0", () => {
    expect(rankBy([-0], 0, identity())).toBe(0);
  });

  test("never counts a NaN element", () => {
    expect(rankBy([NaN, 1], 2, identity())).toBe(1);
  });

  test("ranks a NaN item first", () => {
    expect(rankBy([1, 2], NaN, identity())).toBe(0);
  });

  test("reads holes as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(rankBy([, 1], 2, (value) => value ?? 0)).toBe(2);
  });
});

describe("runtime (dataLast)", () => {
  test("works trivially with empty arrays", () => {
    expect(pipe([], rankBy({ a: 1 }, prop("a")))).toBe(0);
  });

  test("can rank items not in the array", () => {
    expect(
      pipe([{ a: 5 }, { a: 1 }, { a: 3 }], rankBy({ a: 2 }, prop("a"))),
    ).toBe(1);
  });
});

describe("known issues!", () => {
  test("a function `item` is read as an order rule", () => {
    const result = rankBy(
      [() => "foo"],
      () => "bar",
      () => 0,
    );

    // The 2nd argument to `rankBy` represents an item in the array, but
    // because it is a function it is detected as a projection rule, which
    // causes our purrying logic to fail to detect this as a data-first call.
    expect(result).not.toBe(0);

    // Actual
    expect(result).toBeTypeOf("function");
  });
});
