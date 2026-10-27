import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { filter } from "./filter";
import { find } from "./find";
import { first } from "./first";
import { flat } from "./flat";
import { flatMap } from "./flatMap";
import { identity } from "./identity";
import { lazyDataLastImplementation } from "./internal/lazyDataLastImplementation";
import { makeReducing } from "./internal/makeReducing";
import { lazyEmptyEvaluator, makeStoppable } from "./internal/makeStoppable";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type {
  LazyEvaluator,
  StoppableLazyEvaluator,
} from "./internal/types/LazyEvaluator";
import { isStrictEqual } from "./isStrictEqual";
import { join } from "./join";
import { map } from "./map";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { take } from "./take";
import { toUpperCase } from "./toUpperCase";

test("should pass through data with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expect(pipe(data)).toBe(data);
});

test("should pipe a single operation", () => {
  expect(pipe(1, multiply(2))).toBe(2);
});

test("should pipe multiple operations", () => {
  expect(pipe(1, multiply(2), (x) => x * 3)).toBe(6);
});

describe("lazy", () => {
  test("lazy map + filter + take", () => {
    const mapper = vi.fn<(x: number) => number>(identity());

    expect(
      pipe(
        [1, 2, 3, 4, 5],
        map(mapper),
        filter((x) => x % 2 === 1),
        take(2),
      ),
    ).toStrictEqual([1, 3]);
    expect(mapper).toHaveBeenCalledTimes(3);
  });

  test("lazy after 1st op", () => {
    const mapper = vi.fn<<T>(x: T) => T>(identity());

    expect(
      pipe({ inner: [1, 2, 3] }, prop("inner"), map(mapper), take(2)),
    ).toStrictEqual([1, 2]);
    expect(mapper).toHaveBeenCalledTimes(2);
  });

  test("multiple lazy", () => {
    const mapper1 = vi.fn<(x: number) => number>(identity());
    const mapper2 = vi.fn<(x: number) => number>(identity());

    expect(
      pipe(
        [1, 2, 3, 4, 5, 6, 7],
        map(mapper1),
        take(4),
        identity(),
        map(mapper2),
        take(2),
      ),
    ).toStrictEqual([1, 2]);
    expect(mapper1).toHaveBeenCalledTimes(4);
    expect(mapper2).toHaveBeenCalledTimes(2);
  });

  test("stops without a value mid-pipe", () => {
    const mapper = vi.fn<(x: number) => number>();
    const downstream = vi.fn<(x: number) => number>();

    expect(
      pipe([1, 2, 3, 4, 5], map(mapper), take(0), map(downstream)),
    ).toStrictEqual([]);
    // An element must be pulled before `take(0)` can stop the pipe, so the
    // callback runs exactly once even though the result is empty.
    expect(mapper).toHaveBeenCalledTimes(1);
    expect(downstream).not.toHaveBeenCalled();
  });

  test("lazy early exit with a many control", () => {
    expect(
      pipe(
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
        take(1),
        flat(),
      ),
    ).toStrictEqual([1, 2]);
  });

  describe("a reducing step followed by a lazy step", () => {
    test("at the start of a run", () => {
      const dataLengths: number[] = [];

      expect(
        pipe(
          [[1, 2], [3]],
          // @ts-expect-error [ts2345] -- `find` can return `undefined`, which `map` doesn't accept, but this predicate always finds an item.
          find((value, _index, data) => {
            dataLengths.push(data.length);
            return value.length === 1;
          }),
          map(multiply(10)),
        ),
      ).toStrictEqual([30]);
      // A reducing step ends its run, so at the start of one it runs alone,
      // data-first, and its callback sees the whole array.
      expect(dataLengths).toStrictEqual([2, 2]);
    });

    test("ending a fused run", () => {
      expect(
        pipe(
          [[1, 2], [3]] as const,
          map(identity()),
          first(),
          map(multiply(10)),
        ),
      ).toStrictEqual([10, 20]);
    });
  });

  test("callbacks receive the items processed so far", () => {
    const mapper = vi.fn<LazyCallback<unknown[], unknown>>(
      (_value, _index, data) => [...data],
    );
    pipe(
      [1, 2, 3],
      // Keeps the steps lazy: on an array, a run fuses only when one of its
      // steps can stop early, as `take` can.
      take(Infinity),
      map(multiply(10)),
      map(mapper),
    );

    expect(mapper).toHaveNthReturnedWith(1, [10]);
    expect(mapper).toHaveNthReturnedWith(2, [10, 20]);
    expect(mapper).toHaveNthReturnedWith(3, [10, 20, 30]);
  });

  // On an array, a run fuses only when one of its steps can stop early, so
  // the runs below that exercise the fused steps include a `take`.

  describe("step index", () => {
    test("counts items the step consumed, not input positions", () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          take(Infinity),
          filter((x) => x % 2 === 0),
          map((_value, index) => index),
        ),
      ).toStrictEqual([0, 1]);
    });

    test("advances across fan-out", () => {
      expect(
        pipe(
          [[1, 2], [3]],
          take(Infinity),
          flat(),
          map((_value, index) => index),
        ),
      ).toStrictEqual([0, 1, 2]);
    });

    test("advances across consecutive fan-outs", () => {
      expect(
        pipe(
          [[1, 2], [3]],
          take(Infinity),
          flat(),
          flatMap((x) => [x, x + 100]),
          map((_, index) => index),
        ),
      ).toStrictEqual([0, 1, 2, 3, 4, 5]);
    });

    test("advances for the step that fans out", () => {
      expect(
        pipe(
          ["a", "b"],
          take(Infinity),
          flatMap((value, index) => [value, index]),
        ),
      ).toStrictEqual(["a", 0, "b", 1]);
    });
  });

  describe("data buffer", () => {
    test("a fused evaluator that doesn't require `data` gets the sentinel", () => {
      const evaluator = vi.fn<LazyEvaluator>(identity());
      pipe(
        [1, 2, 3],
        take(Infinity),
        lazyDataLastImplementation(identity(), [], () => evaluator),
      );

      // Asserting identity with `toBe` would make the matcher format the
      // sentinel on failure, which throws and hides the real mismatch.
      expect(() => evaluator.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
    });

    test("includes the items a fan-out emitted", () => {
      expect(
        pipe(
          [[1, 2], [3]],
          take(Infinity),
          flat(),
          map((_value, _index, data) => [...data]),
        ),
      ).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
    });
  });

  describe("fan-out", () => {
    test("flatMap to an empty array contributes nothing for that item", () => {
      expect(
        pipe(
          [1, 2, 3],
          take(Infinity),
          flatMap((x) => (x === 2 ? [] : [x])),
          map(multiply(10)),
        ),
      ).toStrictEqual([10, 30]);
    });

    test("a downstream reducing step stops mid fan-out", () => {
      const mapper = vi.fn<<T>(x: T) => T>(identity());

      expect(
        pipe(
          [
            [1, 2, 3],
            [4, 5],
          ],
          map(mapper),
          flat(),
          first(),
        ),
      ).toBe(1);
      expect(mapper).toHaveBeenCalledTimes(1);
    });
  });

  test("`null` items pass through as items, not control signals", () => {
    expect(
      pipe(
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
        [null, 1, null].values(),
        filter((x) => x === null),
      ),
    ).toStrictEqual([null, null]);
  });

  test("symbol items pass through a lone step as items, not control signals", () => {
    const item = Symbol("item");

    expect(
      pipe(
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
        [0].values(),
        map(() => item),
      ),
    ).toStrictEqual([item]);
  });

  test("symbol items pass through fused steps as items, not control signals", () => {
    const item = Symbol("item");

    expect(
      pipe(
        [0],
        map(() => item),
        take(Infinity),
      ),
    ).toStrictEqual([item]);
  });

  test("items are never probed by a lone step", () => {
    // A revoked proxy throws on every trap, so the item survives the pipe only
    // if nothing but its identity was used.
    const { proxy: item, revoke } = Proxy.revocable({}, {});
    revoke();
    const [result] = pipe(
      // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
      [item].values(),
      map(identity()),
    );

    expect(result).toBe(item);
  });

  test("items are never probed by fused steps", () => {
    // A revoked proxy throws on every trap, so the item survives the pipe only
    // if nothing but its identity was used.
    const { proxy: item, revoke } = Proxy.revocable({}, {});
    revoke();

    expect(
      pipe([item], take(Infinity), map(identity()), filter(constant(true)))[0],
    ).toBe(item);
  });

  test("an array input is read by a lone step the way its data-first call reads it", () => {
    const pipeKeys: (string | symbol)[] = [];
    pipe(
      new Proxy([1, 2, 3], {
        get: (target, key, receiver): unknown => {
          pipeKeys.push(key);
          return Reflect.get(target, key, receiver);
        },
      }),
      map(identity()),
    );

    const dataFirstKeys: (string | symbol)[] = [];
    map(
      new Proxy([1, 2, 3], {
        get: (target, key, receiver): unknown => {
          dataFirstKeys.push(key);
          return Reflect.get(target, key, receiver);
        },
      }),
      identity(),
    );

    expect(pipeKeys).toStrictEqual(dataFirstKeys);
  });

  test("an array input is iterated, not indexed, by fused steps", () => {
    const keys: (string | symbol)[] = [];
    pipe(
      new Proxy([1, 2, 3], {
        get: (target, key, receiver): unknown => {
          keys.push(key);
          // The target's own iterator reads the target directly, so only the
          // reads `pipe` makes go through this trap.
          return key === Symbol.iterator
            ? () => target[Symbol.iterator]()
            : Reflect.get(target, key, receiver);
        },
      }),
      take(Infinity),
      map(identity()),
      filter(constant(true)),
    );

    expect(keys).toStrictEqual([Symbol.iterator]);
  });

  describe("controls from another copy of the library are recognized", () => {
    // Re-evaluating the modules gives the utilities imported in each test
    // their own `lazyControl`, the way a second installed version, or the
    // CJS build next to the ESM one, would. The payloads of their controls
    // land in the slot of the pipe that runs them.

    test("a skip from fused steps", async () => {
      vi.resetModules();
      const { filter: otherFilter } = await import("./filter");

      expect(
        pipe(
          [1, 2, 3, 4],
          take(Infinity),
          otherFilter((x) => x % 2 === 0),
        ),
      ).toStrictEqual([2, 4]);
    });

    test("a fan-out feeding a last item in fused steps", async () => {
      vi.resetModules();
      const { find: otherFind } = await import("./find");
      const { flatMap: otherFlatMap } = await import("./flatMap");

      expect(
        pipe(
          [1, 2, 3],
          map(multiply(10)),
          otherFlatMap((x) => [x, x + 1]),
          otherFind((x) => x > 20),
        ),
      ).toBe(21);
    });

    test("a stop from fused steps", async () => {
      vi.resetModules();
      const { take: otherTake } = await import("./take");

      expect(pipe([1, 2, 3], map(identity()), otherTake(0))).toStrictEqual([]);
    });
  });

  // A pipe whose only function is lazy takes a dedicated path through `pipe`,
  // which runs the lazy evaluator on any input that isn't an array, so every
  // kind of lazy result needs to be exercised on such an input too.
  describe("a lone lazy function on a non-array iterable", () => {
    test("skipped items are dropped", () => {
      expect(
        pipe(
          [1, 2, 3, 4].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          filter((x: number) => x % 2 === 0),
        ),
      ).toStrictEqual([2, 4]);
    });

    test("index advances past skipped items", () => {
      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          [1, 2, 3, 4, 5].values(),
          filter((_value, index: number) => index % 2 === 0),
        ),
      ).toStrictEqual([1, 3, 5]);
    });

    test("index advances past fan-outs", () => {
      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          ["a", "b"].values(),
          flatMap((value, index: number) => [value, index]),
        ),
      ).toStrictEqual(["a", 0, "b", 1]);
    });

    test("stopping without a value emits nothing", () => {
      expect(
        pipe(
          [1, 2, 3].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          take(0),
        ),
      ).toStrictEqual([]);
    });

    test("pulls from a non-array iterable only until done", () => {
      expect(
        pipe(
          naturals(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          take(3),
        ),
      ).toStrictEqual([0, 1, 2]);
    });

    test("stopping without a value ends the iteration", () => {
      const evaluator = vi.fn<StoppableLazyEvaluator>(lazyEmptyEvaluator);
      pipe(
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
        [1, 2, 3].values(),
        lazyDataLastImplementation(
          identity(),
          [],
          makeStoppable(() => evaluator),
        ),
      );

      expect(evaluator).toHaveBeenCalledTimes(1);
    });

    test("stopping with a last value unwraps to that value", () => {
      expect(
        pipe(
          [1, 2, 3].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          first(),
        ),
      ).toBe(1);
    });

    test("stopping with a last value ends the iteration", () => {
      const predicate = vi.fn<(x: number) => boolean>(isStrictEqual(2));
      pipe(
        [1, 2, 3].values(),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
        find(predicate),
      );

      expect(predicate).toHaveBeenCalledTimes(2);
    });

    test("nothing to emit unwraps to `undefined`", () => {
      expect(
        pipe(
          [].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          first(),
        ),
      ).toBeUndefined();
    });

    test("fan-out emits every sub-item", () => {
      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          [1, 2].values(),
          flatMap((x: number) => [x, x * 10]),
        ),
      ).toStrictEqual([1, 10, 2, 20]);
    });

    test("an empty fan-out contributes nothing for that item", () => {
      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          [1, 2, 3].values(),
          flatMap((x: number) => (x === 2 ? [] : [x])),
        ),
      ).toStrictEqual([1, 3]);
    });

    test("a large fan-out emits every sub-item", () => {
      expect(
        pipe(
          // Too many sub-items to pass as the arguments of a single call.
          [Array.from({ length: 500_000 }, (_item, index) => index)].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
          flat(),
        ),
      ).toHaveLength(500_000);
    });

    test("an evaluator that doesn't require `data` gets the sentinel", () => {
      const evaluator = vi.fn<LazyEvaluator>(identity());
      pipe(
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but a lone step runs lazily only on other iterables, which is what this test exercises.
        [1, 2, 3].values(),
        lazyDataLastImplementation(identity(), [], () => evaluator),
      );

      expect(() => evaluator.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
    });
  });

  // With nothing to fuse with, a lone lazy function on an array runs its
  // data-first implementation, the same as calling the data-last function
  // directly.
  describe("a lone lazy function on an array", () => {
    test("a callback that doesn't declare `data` gets the array, not the sentinel", () => {
      const data = [1, 2, 3];
      const mapper = vi.fn<
        (value: number, index: number, data: readonly number[]) => number
      >((value, index) => value + index);
      pipe(data, map(mapper));

      expect(mapper.mock.calls[0]?.[2]).toBe(data);
    });

    test("skips holes the way its data-first call does", () => {
      const mapper =
        vi.fn<(x: number | undefined) => number | undefined>(identity());
      // eslint-disable-next-line no-sparse-arrays -- The hole is what this test exercises.
      pipe([1, , 3], map(mapper));

      expect(mapper).toHaveBeenCalledTimes(2);
    });
  });

  test("fused steps visit holes", () => {
    const mapper =
      vi.fn<(x: number | undefined) => number | undefined>(identity());
    // eslint-disable-next-line no-sparse-arrays -- The hole is what this test exercises.
    pipe([1, , 3], take(Infinity), map(mapper));

    expect(mapper).toHaveBeenCalledTimes(3);
  });

  // A run fuses when one of its steps can stop the pipe early. Without one,
  // every item goes through every step anyway, so on an array each function
  // runs its data-first implementation in turn instead.
  describe("run order", () => {
    test("a run on an array that can't stop early runs step by step", () => {
      const calls: string[] = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push("map");
          return x;
        }),
        filter(() => {
          calls.push("filter");
          return true;
        }),
      );

      expect(calls).toStrictEqual(["map", "map", "filter", "filter"]);
    });

    test("a run with a step that can stop early runs item by item", () => {
      const calls: string[] = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push("map");
          return x;
        }),
        filter(() => {
          calls.push("filter");
          return true;
        }),
        take(Infinity),
      );

      expect(calls).toStrictEqual(["map", "filter", "map", "filter"]);
    });

    test("a run on another iterable runs item by item", () => {
      const calls: string[] = [];
      pipe(
        [1, 2].values(),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map((x: number) => {
          calls.push("map");
          return x;
        }),
        filter(() => {
          calls.push("filter");
          return true;
        }),
      );

      expect(calls).toStrictEqual(["map", "filter", "map", "filter"]);
    });
  });

  describe("a run on an array that can't stop early", () => {
    test("the first step's callbacks get the input array", () => {
      const data = [1, 2, 3];
      const mapper = vi.fn<
        (value: number, index: number, data: readonly number[]) => number
      >((value, index, items) => value + index + items.length);
      pipe(data, map(mapper), filter(constant(true)));

      expect(mapper.mock.calls[0]?.[2]).toBe(data);
    });

    test("a later step's callbacks get the previous step's complete output", () => {
      const mapper = vi.fn<LazyCallback<unknown[], unknown>>(
        (_value, _index, data) => [...data],
      );
      pipe([1, 2, 3], map(multiply(10)), map(mapper));

      expect(mapper).toHaveNthReturnedWith(1, [10, 20, 30]);
      expect(mapper).toHaveNthReturnedWith(2, [10, 20, 30]);
      expect(mapper).toHaveNthReturnedWith(3, [10, 20, 30]);
    });

    test("a callback that doesn't declare `data` gets the array, not the sentinel", () => {
      const mapper = vi.fn<
        (value: number, index: number, data: readonly number[]) => number
      >((value, index) => value + index);
      pipe([1, 2, 3], map(multiply(10)), map(mapper));

      expect(mapper.mock.calls[0]?.[2]).toStrictEqual([10, 20, 30]);
    });

    test("skips holes the way its data-first calls do", () => {
      const mapper =
        vi.fn<(x: number | undefined) => number | undefined>(identity());
      // eslint-disable-next-line no-sparse-arrays -- The hole is what this test exercises.
      pipe([1, , 3], map(identity()), map(mapper));

      expect(mapper).toHaveBeenCalledTimes(2);
    });

    test("the input is read the way the first step's data-first call reads it", () => {
      const pipeKeys: (string | symbol)[] = [];
      pipe(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            pipeKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        map(identity()),
        filter(constant(true)),
      );

      const dataFirstKeys: (string | symbol)[] = [];
      map(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            dataFirstKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        identity(),
      );

      expect(pipeKeys).toStrictEqual(dataFirstKeys);
    });

    test("ends at a non-lazy function", () => {
      const calls: string[] = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push("map");
          return x;
        }),
        filter(() => {
          calls.push("filter");
          return true;
        }),
        identity(),
        take(1),
      );

      expect(calls).toStrictEqual(["map", "map", "filter", "filter"]);
    });

    test("ends after a reducing step", () => {
      // A reducing step that can't stop early, which no utility is. Were
      // the run to go on past it, it would reach `take`, which can stop early,
      // and fuse.
      const firstItem = lazyDataLastImplementation(
        (data: readonly (readonly number[])[]) => data[0] ?? [],
        [],
        makeReducing(() => identity()),
      );
      const dataLengths: number[] = [];
      const result = pipe(
        [[1, 2], [3]],
        map((value, _index, data) => {
          dataLengths.push(data.length);
          return value;
        }),
        firstItem,
        take(1),
      );

      expect(result).toStrictEqual([1]);
      expect(dataLengths).toStrictEqual([2, 2]);
    });
  });

  test("a run of one lazy function between two non-lazy ones", () => {
    expect(
      pipe({ inner: [1, 2, 3] }, prop("inner"), map(multiply(10)), join(",")),
    ).toBe("10,20,30");
  });

  test("fused steps pull from a non-array iterable only until done", () => {
    expect(
      pipe(
        naturals(),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map(multiply(10)),
        take(3),
      ),
    ).toStrictEqual([0, 10, 20]);
  });

  // A lone step runs the data-first implementation on an array, which hands
  // its callbacks the complete array, and the lazy runner on every other
  // iterable, which fills the data buffer and counts the index.
  test.each([
    [
      "an array",
      "the complete array",
      (): readonly number[] => [1, 2, 3, 4],
      [
        [1, 0, [1, 2, 3, 4]],
        [2, 1, [1, 2, 3, 4]],
        [3, 2, [1, 2, 3, 4]],
        [4, 3, [1, 2, 3, 4]],
      ],
    ],
    [
      "a generator",
      "the items so far",
      // @ts-expect-error [ts2740] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
      (): readonly number[] => upTo(4),
      [
        [1, 0, [1]],
        [2, 1, [1, 2]],
        [3, 2, [1, 2, 3]],
        [4, 3, [1, 2, 3, 4]],
      ],
    ],
  ])(
    "a lone step on %s gets each item's index and %s",
    (_name, _data, input, expected) => {
      expect(
        pipe(
          input(),
          map((x, index, data) => [x, index, [...data]]),
        ),
      ).toStrictEqual(expected);
    },
  );

  // A lone step next to non-lazy steps runs from the main loop of `pipe`, not
  // from the path for a pipe of a single function.
  describe.each([
    [
      "an array",
      "the complete array",
      (): readonly number[] => [1, 2, 3, 4],
      [
        [1, 0, [1, 2, 3, 4]],
        [2, 1, [1, 2, 3, 4]],
        [3, 2, [1, 2, 3, 4]],
        [4, 3, [1, 2, 3, 4]],
      ],
    ],
    [
      "a generator",
      "the items so far",
      // @ts-expect-error [ts2740] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
      (): readonly number[] => upTo(4),
      [
        [1, 0, [1]],
        [2, 1, [1, 2]],
        [3, 2, [1, 2, 3]],
        [4, 3, [1, 2, 3, 4]],
      ],
    ],
  ])(
    "a lone step after a non-lazy step, on %s, gets each item's index and %s",
    (_name, _data, input, expected) => {
      test("as the last step", () => {
        expect(
          pipe(
            input(),
            identity(),
            map((x, index, data) => [x, index, [...data]]),
          ),
        ).toStrictEqual(expected);
      });

      test("before another non-lazy step", () => {
        expect(
          pipe(
            input(),
            identity(),
            map((x, index, data) => [x, index, [...data]]),
            identity(),
          ),
        ).toStrictEqual(expected);
      });
    },
  );

  describe("a generator input is closed when the pipe stops early", () => {
    test("by a lone step", () => {
      const onClose = vi.fn<() => void>();
      pipe(
        closesWith(onClose),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        take(1),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("by fused steps", () => {
      const onClose = vi.fn<() => void>();
      pipe(
        closesWith(onClose),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map((x: number) => x),
        take(1),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("a string input is iterated by character", () => {
    test("by a lone step", () => {
      expect(
        pipe(
          "abc",
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          map(toUpperCase()),
        ),
      ).toStrictEqual(["A", "B", "C"]);
    });

    test("by fused steps", () => {
      expect(
        pipe(
          "abc",
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          map(toUpperCase()),
          take(2),
        ),
      ).toStrictEqual(["A", "B"]);
    });
  });
});

// Never finishes on its own, so only a pipe that stops pulling can consume it.
function* naturals(): Generator<number> {
  for (let value = 0; ; value++) {
    yield value;
  }
}

function* upTo(last: number): Generator<number> {
  for (let value = 1; value <= last; value++) {
    yield value;
  }
}

// A `for...of` that exits early closes the generator, which runs its `finally`.
function* closesWith(onClose: () => void): Generator<number> {
  try {
    yield* [1, 2, 3];
  } finally {
    onClose();
  }
}
