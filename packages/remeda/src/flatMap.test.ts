import { describe, expect, test, vi } from "vitest";
import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { forceFusion } from "../test/forceFusion";
import { add } from "./add";
import { find } from "./find";
import { flatMap } from "./flatMap";
import type { LazyCallback } from "./internal/types/LazyCallback";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("flatMap", () => {
    const result = flatMap([1, 2] as const, (x) => [x * 2, x * 3]);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("should accept fn returning a readonly array", () => {
    const result = flatMap([1, 2] as const, (x) => [x * 2, x * 3] as const);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });
});

describe("dataLast", () => {
  test("flatMap", () => {
    const result = flatMap((x: number) => [x * 2, x * 3])([1, 2]);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("should accept fn returning a readonly array", () => {
    const result = flatMap((x: number) => [x * 2, x * 3] as const)([
      1, 2,
    ] as const);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("works with non array outputs", () => {
    expect(pipe([1, 2, 3], flatMap(add(1)))).toStrictEqual([2, 3, 4]);
  });

  describe(pipe, () => {
    test("with find", () => {
      const counter1 = createLazyInvocationCounter();
      const counter2 = createLazyInvocationCounter();
      const result = pipe(
        [10, 20, 30, 40] as const,
        counter1.fn(),
        flatMap((x) => [x, x + 1, x + 2, x + 3]),
        counter2.fn(),
        find((x) => x === 22),
      );

      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(7);
      expect(result).toBe(22);
    });

    test("works with non array outputs", () => {
      expect(pipe([1, 2, 3], forceFusion(), flatMap(add(1)))).toStrictEqual([
        2, 3, 4,
      ]);
    });

    test("provides the items processed so far to the callback", () => {
      const mapper = vi.fn<LazyCallback<unknown[], unknown>>(
        (_value, _index, data) => [...data],
      );
      pipe([1, 2, 3], forceFusion(), flatMap(mapper));

      expect(mapper).toHaveNthReturnedWith(1, [1]);
      expect(mapper).toHaveNthReturnedWith(2, [1, 2]);
      expect(mapper).toHaveNthReturnedWith(3, [1, 2, 3]);
    });

    test("doesn't collect the items processed so far for a callback without `data`", () => {
      const callback = vi.fn<
        (value: number, index: number, data: readonly number[]) => number[]
      >((value, index) => [value + index]);
      pipe([1, 2, 3], forceFusion(), flatMap(callback));

      expect(() => callback.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
    });
  });
});
