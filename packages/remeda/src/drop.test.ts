import { describe, expect, test, vi } from "vitest";
import { drop } from "./drop";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("data first", () => {
  test("works on regular inputs", () => {
    expect(drop([1, 2, 3, 4, 5], 2)).toStrictEqual([3, 4, 5]);
  });

  test("works trivially on empty arrays", () => {
    expect(drop([], 2)).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(drop([1, 2, 3, 4, 5], -1)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("works when dropping more than the length of the array", () => {
    expect(drop([1, 2, 3, 4, 5], 10)).toStrictEqual([]);
  });

  test("returns a shallow clone when no items are dropped", () => {
    const data = [1, 2, 3, 4, 5];
    const result = drop(data, 0);

    expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(data);
  });
});

describe("data last", () => {
  test("works on regular inputs", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(2))).toStrictEqual([3, 4, 5]);
  });

  test("works trivially on empty arrays", () => {
    expect(pipe([], drop(2))).toStrictEqual([]);
  });

  test("works trivially with negative numbers", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(-1))).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("works when dropping more than the length of the array", () => {
    expect(pipe([1, 2, 3, 4, 5], drop(10))).toStrictEqual([]);
  });

  test("lazy impl", () => {
    const mockFunc = vi.fn<(x: number) => number>();
    pipe([1, 2, 3, 4, 5], map(mockFunc), drop(2), take(2));

    expect(mockFunc).toHaveBeenCalledTimes(4);
  });
});
