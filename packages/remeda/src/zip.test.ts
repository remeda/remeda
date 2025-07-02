import { describe, expect, test, vi } from "vitest";
import { first } from "./first";
import { map } from "./map";
import { pipe } from "./pipe";
import { zip } from "./zip";

describe("dataFirst", () => {
  test("should zip", () => {
    expect(zip([1, 2, 3], ["a", "b", "c"])).toStrictEqual([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  });

  test("should truncate to shorter second", () => {
    expect(zip([1, 2, 3], ["a", "b"])).toStrictEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  test("should truncate to shorter first", () => {
    expect(zip([1, 2], ["a", "b", "c"])).toStrictEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });
});

describe("dataLast", () => {
  test("should zip", () => {
    expect(pipe([1, 2, 3], zip(["a", "b", "c"]))).toStrictEqual([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  });

  test("should truncate to shorter second", () => {
    expect(pipe([1, 2, 3], zip(["a", "b"]))).toStrictEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  test("should truncate to shorter first", () => {
    expect(pipe([1, 2], zip(["a", "b", "c"]))).toStrictEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  test("evaluates lazily", () => {
    const mockFn = vi.fn<(x: number) => number>();
    pipe([1, 2, 3], map(mockFn), zip([4, 5, 6]), first());

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
