import { describe, expect, test, vi } from "vitest";
import { filter } from "./filter";
import { find } from "./find";
import { first } from "./first";
import { flat } from "./flat";
import { flatMap } from "./flatMap";
import { forEach } from "./forEach";
import { identity } from "./identity";
import { lazyEmptyEvaluator } from "./internal/lazyControl";
import { purryFromLazy } from "./internal/purryFromLazy";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { map } from "./map";
import { pipe } from "./pipe";
import { piped } from "./piped";
import { prop } from "./prop";
import { take } from "./take";
import { uniqueWith } from "./uniqueWith";

test("should pass through data with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expect(pipe(data)).toBe(data);
});

test("should pipe a single operation", () => {
  const result = pipe(1, (x) => x * 2);

  expect(result).toBe(2);
});

test("should pipe operations", () => {
  const result = pipe(
    1,
    (x) => x * 2,
    (x) => x * 3,
  );

  expect(result).toBe(6);
});

describe("lazy", () => {
  test("lazy map + take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  test("lazy map + filter + take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((x) => {
        count();
        return x * 10;
      }),
      filter((x) => (x / 10) % 2 === 1),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 30]);
  });

  test("lazy after 1st op", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      { inner: [1, 2, 3] },
      prop("inner"),
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  test("break lazy", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      (x) => x,
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 20]);
  });

  test("multiple take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
      take(1),
    );

    expect(count).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([10]);
  });

  test("multiple lazy", () => {
    const count = vi.fn<() => void>();
    const count2 = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5, 6, 7],
      map((x) => {
        count();
        return x * 10;
      }),
      take(4),
      identity(),
      map((x) => {
        count2();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(4);
    expect(count2).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([100, 200]);
  });

  test("stops without a value", () => {
    const mockMapper = vi.fn<(x: number) => number>();

    expect(pipe([1, 2, 3, 4, 5], map(mockMapper), take(0))).toStrictEqual([]);
    // An element must be pulled before `take(0)` can stop the pipe, so the
    // callback runs exactly once even though the result is empty.
    expect(mockMapper).toHaveBeenCalledTimes(1);
  });

  test("stops without a value mid-pipe", () => {
    const mockMapper = vi.fn<(x: number) => number>();
    const downstream = vi.fn<(x: number) => number>();

    expect(
      pipe([1, 2, 3, 4, 5], map(mockMapper), take(0), map(downstream)),
    ).toStrictEqual([]);
    expect(mockMapper).toHaveBeenCalledTimes(1);
    expect(downstream).not.toHaveBeenCalled();
  });

  test("lazy early exit with a many control", () => {
    const result = pipe(
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      take(1),
      flat(),
    );

    expect(result).toStrictEqual([1, 2]);
  });

  describe("a single-result step followed by a lazy step", () => {
    test("at the start of a run", () => {
      expect(
        pipe(
          [[1, 2], [3]] as const,
          first(),
          map((x) => x * 10),
        ),
      ).toStrictEqual([10, 20]);
    });

    test("ending a fused run", () => {
      expect(
        pipe(
          [[1, 2], [3]] as const,
          map((x) => x),
          first(),
          map((x) => x * 10),
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
      map((x) => x * 10),
      map(mapper),
    );

    expect(mapper).toHaveNthReturnedWith(1, [10]);
    expect(mapper).toHaveNthReturnedWith(2, [10, 20]);
    expect(mapper).toHaveNthReturnedWith(3, [10, 20, 30]);
  });

  describe("step index", () => {
    test("counts items the step consumed, not input positions", () => {
      const result = pipe(
        [1, 2, 3, 4],
        filter((x) => x % 2 === 0),
        map((_value, index) => index),
      );

      expect(result).toStrictEqual([0, 1]);
    });

    test("advances across fan-out", () => {
      const result = pipe(
        [[1, 2], [3]],
        flat(),
        map((_value, index) => index),
      );

      expect(result).toStrictEqual([0, 1, 2]);
    });

    test("advances for the step that fans out", () => {
      expect(
        pipe(
          ["a", "b"],
          map((x) => x),
          flatMap((value, index) => [value, index]),
        ),
      ).toStrictEqual(["a", 0, "b", 1]);
    });

    test("independent per step", () => {
      const upstreamIndices: number[] = [];
      const result = pipe(
        [
          [1, 2],
          [3, 4],
        ],
        map((inner, index) => {
          upstreamIndices.push(index);
          return inner;
        }),
        flat(),
        map((_value, index) => index),
      );

      expect(upstreamIndices).toStrictEqual([0, 1]);
      expect(result).toStrictEqual([0, 1, 2, 3]);
    });
  });

  describe("data buffer", () => {
    test("a rest-parameter callback buffers because `Function.length` is 0", () => {
      const result = pipe(
        [1, 2, 3],
        map((...args: readonly [number, number, readonly number[]]) => [
          ...args[2],
        ]),
      );

      expect(result).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
    });

    test("a mock created without an implementation buffers because it reports `length` 0", () => {
      const callback = vi.fn<LazyCallback<unknown[], unknown>>();
      // Implemented after creation so `length` stays 0.
      callback.mockImplementation((_value, _index, data) => [...data]);

      pipe([1, 2, 3], forEach(callback));

      expect(callback).toHaveNthReturnedWith(1, [1]);
      expect(callback).toHaveNthReturnedWith(2, [1, 2]);
      expect(callback).toHaveNthReturnedWith(3, [1, 2, 3]);
    });

    test("a callback bound with partial application still reports the remaining arity", () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping -- The declared arity is the subject of this test, hoisting it out of the test would separate it from the assertion that explains it.
      function collect(
        tag: string,
        _value: number,
        _index: number,
        data: readonly number[],
      ): unknown[] {
        return [tag, ...data];
      }

      const result = pipe([1, 2, 3], map(collect.bind(undefined, "t")));

      expect(result).toStrictEqual([
        ["t", 1],
        ["t", 1, 2],
        ["t", 1, 2, 3],
      ]);
    });

    test("a fused evaluator that doesn't require `data` gets the sentinel", () => {
      const evaluator = vi.fn<LazyEvaluator>((value) => value);
      pipe(
        [1, 2, 3],
        map((x) => x),
        // @ts-expect-error [ts2345] -- `purryFromLazy` returns `unknown`; the step only exists to expose what `pipe` hands its evaluator.
        purryFromLazy(() => evaluator, []),
      );

      // Asserting identity with `toBe` would make the matcher format the
      // sentinel on failure, which throws and hides the real mismatch.
      expect(() => evaluator.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
    });

    test("includes the items a fan-out emitted", () => {
      expect(
        pipe(
          [[1, 2], [3]],
          flat(),
          map((_value, _index, data) => [...data]),
        ),
      ).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
    });

    test("an evaluator that reads it sees the items a fan-out emitted", () => {
      expect(
        pipe(
          [
            [1, 1],
            [2, 1],
          ],
          flat(),
          uniqueWith((a, b) => a === b),
        ),
      ).toStrictEqual([1, 2]);
    });
  });

  describe("fan-out", () => {
    test("flatMap to an empty array contributes nothing for that item", () => {
      const result = pipe(
        [1, 2, 3],
        flatMap((x) => (x === 2 ? [] : [x])),
        map((x) => x * 10),
      );

      expect(result).toStrictEqual([10, 30]);
    });

    test("a downstream single-result step stops mid fan-out", () => {
      const count = vi.fn<() => void>();
      const result = pipe(
        [
          [1, 2, 3],
          [4, 5],
        ],
        map((inner) => {
          count();
          return inner;
        }),
        flat(),
        first(),
      );

      expect(count).toHaveBeenCalledTimes(1);
      expect(result).toBe(1);
    });

    test("`null` items pass through as items, not control signals", () => {
      const result = pipe(
        [null, 1, null],
        filter((x) => x === null),
      );

      expect(result).toStrictEqual([null, null]);
    });

    test("symbols described like the controls pass through as data", () => {
      // Same description as a real control, but not the registered symbol.
      const lookalike = Symbol("$$remedaLazySkip");

      expect(
        pipe(
          [0],
          map(() => lookalike),
        ),
      ).toStrictEqual([lookalike]);

      // A fused run checks controls in its own loop.
      expect(
        pipe(
          [0],
          map(() => lookalike),
          map((x) => x),
        ),
      ).toStrictEqual([lookalike]);
    });

    test("items are never probed", () => {
      const has = vi.fn<() => boolean>(() => true);
      const get = vi.fn<() => unknown>();
      const item = new Proxy({}, { has, get });

      const single = pipe(
        [item],
        map((x) => x),
      );
      const fused = pipe(
        [item],
        map((x) => x),
        filter(() => true),
      );

      // Checked before the results, which the matchers would probe themselves.
      expect(has).not.toHaveBeenCalled();
      expect(get).not.toHaveBeenCalled();
      expect(single[0]).toBe(item);
      expect(fused[0]).toBe(item);
    });

    test.each([
      [
        "a lone step",
        (data: readonly number[]) =>
          pipe(
            data,
            map((x) => x),
          ),
      ],
      [
        "fused steps",
        (data: readonly number[]) =>
          pipe(
            data,
            map((x) => x),
            filter(() => true),
          ),
      ],
    ])("an array input is iterated, not indexed, by %s", (_name, run) => {
      const keys: (string | symbol)[] = [];
      const data = new Proxy([1, 2, 3], {
        get: (target, key, receiver): unknown => {
          keys.push(key);
          // The target's own iterator reads the target directly, so only the
          // reads `pipe` makes go through this trap.
          return key === Symbol.iterator
            ? () => target[Symbol.iterator]()
            : Reflect.get(target, key, receiver);
        },
      });

      run(data);

      expect(keys).toStrictEqual([Symbol.iterator]);
    });

    test("controls from another copy of the library are recognized", async () => {
      // Re-evaluating the modules gives the utilities below their own
      // `lazyControl`, the way a second installed version, or the CJS build
      // next to the ESM one, would. The payloads of their controls land in
      // the slot of the pipe that runs them.
      vi.resetModules();
      const { filter: otherFilter } = await import("./filter");
      const { find: otherFind } = await import("./find");
      const { flatMap: otherFlatMap } = await import("./flatMap");
      const { take: otherTake } = await import("./take");

      expect(
        pipe(
          [1, 2, 3, 4],
          otherFilter((x) => x % 2 === 0),
        ),
      ).toStrictEqual([2, 4]);
      expect(
        pipe(
          [1, 2],
          otherFlatMap((x) => [x, x * 10]),
        ),
      ).toStrictEqual([1, 10, 2, 20]);
      expect(
        pipe(
          [1, 2, 3],
          otherFind((x) => x > 1),
        ),
      ).toBe(2);
      expect(
        pipe(
          [1, 2, 3],
          map((x) => x * 10),
          otherFlatMap((x) => [x, x + 1]),
          otherFind((x) => x > 20),
        ),
      ).toBe(21);
      expect(pipe([1, 2, 3], otherTake(0))).toStrictEqual([]);
      expect(
        pipe(
          [1, 2, 3],
          map((x) => x),
          otherTake(0),
        ),
      ).toStrictEqual([]);
    });

    test("index continues across two consecutive fan-outs", () => {
      const result = pipe(
        [[1, 2], [3]],
        flat(),
        flatMap((x) => [x, x + 100]),
        map((_, index) => index),
      );

      expect(result).toStrictEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  // A pipe whose only function is lazy takes a dedicated path through `pipe`,
  // so every kind of lazy result needs to be exercised on it too.
  describe("a lone lazy function", () => {
    test("skipped items are dropped", () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          filter((x) => x % 2 === 0),
        ),
      ).toStrictEqual([2, 4]);
    });

    test("index advances past skipped items", () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5],
          filter((_value, index) => index % 2 === 0),
        ),
      ).toStrictEqual([1, 3, 5]);
    });

    test("index advances past fan-outs", () => {
      expect(
        pipe(
          ["a", "b"],
          flatMap((value, index) => [value, index]),
        ),
      ).toStrictEqual(["a", 0, "b", 1]);
    });

    test("stopping without a value emits nothing", () => {
      expect(pipe([1, 2, 3], take(0))).toStrictEqual([]);
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
      const evaluator = vi.fn<LazyEvaluator>(lazyEmptyEvaluator);

      pipe(
        [1, 2, 3],
        // @ts-expect-error [ts2345] -- `purryFromLazy` returns `unknown`; the overloads of the utilities built on it are what make the result a function.
        purryFromLazy(() => evaluator, []),
      );

      expect(evaluator).toHaveBeenCalledTimes(1);
    });

    test("stopping with a last value unwraps to that value", () => {
      expect(pipe([1, 2, 3], first())).toBe(1);
    });

    test("stopping with a last value ends the iteration", () => {
      const mockPredicate = vi.fn<(x: number) => boolean>((x) => x === 2);

      pipe([1, 2, 3], find(mockPredicate));

      expect(mockPredicate).toHaveBeenCalledTimes(2);
    });

    test("nothing to emit unwraps to `undefined`", () => {
      expect(pipe([], first())).toBeUndefined();
    });

    test("fan-out emits every sub-item", () => {
      expect(
        pipe(
          [1, 2],
          flatMap((x) => [x, x * 10]),
        ),
      ).toStrictEqual([1, 10, 2, 20]);
    });

    test("an empty fan-out contributes nothing for that item", () => {
      expect(
        pipe(
          [1, 2, 3],
          flatMap((x) => (x === 2 ? [] : [x])),
        ),
      ).toStrictEqual([1, 3]);
    });

    test("a large fan-out emits every sub-item", () => {
      // Too many sub-items to pass as the arguments of a single call.
      const large = Array.from({ length: 500_000 }, (_item, index) => index);

      expect(pipe([large], flat())).toHaveLength(500_000);
    });

    test("reused as the only lazy step, starts fresh on every run", () => {
      expect(
        map(
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
          piped(take(2)),
        ),
      ).toStrictEqual([
        [1, 2],
        [4, 5],
      ]);
    });

    test("callbacks receive the items processed so far", () => {
      const mock = vi.fn<LazyCallback<unknown[], unknown>>(
        (_value, _index, data) => [...data],
      );
      pipe([1, 2, 3], forEach(mock));

      expect(mock).toHaveNthReturnedWith(2, [1, 2]);
    });

    test("an evaluator that doesn't require `data` gets the sentinel", () => {
      const evaluator = vi.fn<LazyEvaluator>((value) => value);
      pipe(
        [1, 2, 3],
        // @ts-expect-error [ts2345] -- `purryFromLazy` returns `unknown`; the step only exists to expose what `pipe` hands its evaluator.
        purryFromLazy(() => evaluator, []),
      );

      const data = evaluator.mock.calls[0]?.[2];

      expect(() => data?.at(0)).toThrow(/^Remeda: /u);
    });

    test("a non-lazy function alongside it opts the pipe out", () => {
      const result = pipe(
        [1, 2, 3],
        map((x) => x * 10),
        (values) => values.join(","),
      );

      expect(result).toBe("10,20,30");
    });
  });

  test("reused among several fused lazy steps, starts fresh on every run", () => {
    expect(
      map(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        piped(
          map((x) => x * 10),
          take(2),
        ),
      ),
    ).toStrictEqual([
      [10, 20],
      [40, 50],
    ]);
  });

  test("one lazy function between two non-lazy ones", () => {
    const result = pipe(
      { inner: [1, 2, 3] },
      prop("inner"),
      map((x) => x * 10),
      (values) => values.join(","),
    );

    expect(result).toBe("10,20,30");
  });

  test("fused steps pull from a non-array iterable only until done", () => {
    expect(
      pipe(
        naturals(),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map((x: number) => x * 10),
        take(3),
      ),
    ).toStrictEqual([0, 10, 20]);
  });

  // Arrays and every other iterable run through separate loops, in both the
  // lone-step path and the fused one.
  describe.each([
    ["an array", (): readonly number[] => [1, 2, 3, 4]],
    // @ts-expect-error [ts2740] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what these tests exercise.
    ["a Set", (): readonly number[] => new Set([1, 2, 3, 4])],
    // @ts-expect-error [ts2740] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what these tests exercise.
    ["a generator", (): readonly number[] => upTo(4)],
  ])("%s as input", (_name, input) => {
    test("a lone step gets each item's index and the items so far", () => {
      expect(
        pipe(
          input(),
          map((x, index, data) => [x, index, [...data]]),
        ),
      ).toStrictEqual([
        [1, 0, [1]],
        [2, 1, [1, 2]],
        [3, 2, [1, 2, 3]],
        [4, 3, [1, 2, 3, 4]],
      ]);
    });

    test("a lone step skips items", () => {
      expect(
        pipe(
          input(),
          filter((x) => x % 2 === 0),
        ),
      ).toStrictEqual([2, 4]);
    });

    test("a lone step fans out", () => {
      expect(
        pipe(
          input(),
          flatMap((x) => [x, -x]),
        ),
      ).toStrictEqual([1, -1, 2, -2, 3, -3, 4, -4]);
    });

    test("a lone step stops with a last value", () => {
      expect(pipe(input(), take(2))).toStrictEqual([1, 2]);
    });

    test("a lone single-result step unwraps to its value", () => {
      expect(pipe(input(), first())).toBe(1);
    });

    test("fused steps", () => {
      expect(
        pipe(
          input(),
          filter((x) => x !== 2),
          flatMap((x) => [x, x * 10]),
          map((x, index, data) => [x, index, data.length]),
          take(4),
        ),
      ).toStrictEqual([
        [1, 0, 1],
        [10, 1, 2],
        [3, 2, 3],
        [30, 3, 4],
      ]);
    });
  });

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
          map((x: string) => x.toUpperCase()),
        ),
      ).toStrictEqual(["A", "B", "C"]);
    });

    test("by fused steps", () => {
      expect(
        pipe(
          "abc",
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          map((x: string) => x.toUpperCase()),
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

describe("known issues!", () => {
  test("default parameters hide `data` from the arity check", () => {
    // `Function.length` stops counting at the first parameter with a
    // default, so this callback reports 1 and `pipe` hands it
    // `UNEXPECTED_ACCESS_SENTINEL` instead of buffering; the default never
    // fires because an argument is always passed.
    expect(() =>
      pipe(
        [1, 2, 3],
        // eslint-disable-next-line @typescript-eslint/no-useless-default-assignment -- The defaults never fire, and that is the point: they still truncate `Function.length`, which is the known issue this test pins.
        map((_value: number, _index = 0, data: readonly number[] = []) =>
          data.at(0),
        ),
      ),
    ).toThrow(/^Remeda: /u);
  });

  test("`arguments` access hides `data` from the arity check", () => {
    // A `function` expression that reaches for `arguments` instead of
    // declaring `data` also reports a `length` of 1, so `pipe` hands it
    // `UNEXPECTED_ACCESS_SENTINEL` instead of buffering.
    expect(() =>
      pipe(
        [1, 2, 3],
        map(function readsArguments(_value: number) {
          // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment -- The point of this test is that arguments-based access is invisible to the arity check, and `arguments` is untyped by construction so spreading it is unavoidably unsafe here.
          return [...arguments[2]];
        }),
      ),
    ).toThrow(/^Remeda: /u);
  });

  test("a trailing rest parameter hides `data` from the arity check", () => {
    // `Function.length` counts only the named parameters before a rest
    // parameter, so this callback reports 2 and `pipe` hands `rest[0]`
    // `UNEXPECTED_ACCESS_SENTINEL` instead of buffering.
    expect(() =>
      pipe(
        [1, 2, 3],
        map(
          (
            _value: number,
            _index: number,
            ...rest: readonly [readonly number[]]
          ) => [...rest[0]],
        ),
      ),
    ).toThrow(/^Remeda: /u);
  });
});
