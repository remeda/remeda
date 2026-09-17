import { describe, expect, test, vi } from "vitest";
import { filter } from "./filter";
import { first } from "./first";
import { flat } from "./flat";
import { flatMap } from "./flatMap";
import { forEach } from "./forEach";
import { identity } from "./identity";
import { purryFromLazy } from "./internal/purryFromLazy";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { LAZY_REF } from "./internal/utilityEvaluators";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { take } from "./take";

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

  test("early exit when done without a next value", () => {
    const mockMapper = vi.fn<(x: number) => number>();

    expect(pipe([1, 2, 3, 4, 5], map(mockMapper), take(0))).toStrictEqual([]);
    // An element must be pulled before `take(0)` can report `isDone`, so the
    // callback runs exactly once even though the result is empty.
    expect(mockMapper).toHaveBeenCalledTimes(1);
  });

  test("early exit when done without a next value mid-pipe", () => {
    const mockMapper = vi.fn<(x: number) => number>();
    const downstream = vi.fn<(x: number) => number>();

    expect(
      pipe([1, 2, 3, 4, 5], map(mockMapper), take(0), map(downstream)),
    ).toStrictEqual([]);
    expect(mockMapper).toHaveBeenCalledTimes(1);
    expect(downstream).not.toHaveBeenCalled();
  });

  test("lazy early exit with hasMany", () => {
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

  test("early exit when done with many next values", () => {
    const mockMapper = vi.fn<(x: number) => number>(identity());

    expect(pipe([1, 2, 3, 4, 5], map(mockMapper), firstTwice())).toStrictEqual([
      1, 1,
    ]);
    expect(mockMapper).toHaveBeenCalledTimes(1);
  });

  test("callbacks receive the items processed so far", () => {
    const mock = vi.fn<LazyCallback<unknown[], unknown>>(
      (_value, _index, data) => [...data],
    );
    pipe([1, 2, 3], map(mock));

    expect(mock).toHaveNthReturnedWith(1, [1]);
    expect(mock).toHaveNthReturnedWith(2, [1, 2]);
    expect(mock).toHaveNthReturnedWith(3, [1, 2, 3]);
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

    test("a bare `vi.fn()` mock buffers because it also reports `length` 0", () => {
      const mock =
        vi.fn<
          (value: number, index: number, data: readonly number[]) => void
        >();

      pipe([1, 2, 3], forEach(mock));

      expect(mock.mock.calls[0]?.[2]).toBe(mock.mock.calls[2]?.[2]);
      expect(mock.mock.calls[2]?.[2]).toStrictEqual([1, 2, 3]);
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
  });

  describe("fan-out", () => {
    test("flatMap to an empty array contributes nothing for that item", () => {
      const result = pipe(
        [1, 2, 3],
        flatMap(() => []),
      );

      expect(result).toStrictEqual([]);
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

    test("items with string keys named like the control props pass through as data", () => {
      const lookalike = {
        isDone: true,
        hasValue: true,
        hasMany: false,
        value: 1,
      };

      expect(
        pipe(
          [0],
          map(() => lookalike),
        ),
      ).toStrictEqual([lookalike]);
    });

    test("a Proxy whose `has` trap always answers true still passes through as data", () => {
      const trap = new Proxy({ value: 1 }, { has: () => true });

      const result = pipe(
        [trap],
        map((x) => x),
      );

      // The trap makes the `in` check pass, but control objects are told apart
      // by the identity of the marker and the read behind the trap answers
      // with the target's own (absent) prop, so a lying `has` can't forge one.
      expect(result).toStrictEqual([trap]);
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
});

// We want to test a lazy evaluator that sets both `isDone` and `hasMany` at the
// same time but don't have any utility that does it.
const firstTwice: () => (data: readonly number[]) => number[] = () =>
  // @ts-expect-error [ts2322] -- Our purry functions don't infer the correct return type, we explicit casting to force it.
  purryFromLazy(() => firstTwiceEvaluator, []);

const firstTwiceEvaluator: LazyEvaluator = (value) => ({
  $$remedaLazyRef: LAZY_REF,
  isDone: true,
  hasValue: true,
  hasMany: true,
  value: [value, value],
});

describe("known issues!", () => {
  test("default parameters hide `data` from the arity check", () => {
    const result = pipe(
      [1, 2, 3],
      // eslint-disable-next-line @typescript-eslint/no-useless-default-assignment -- The defaults never fire, and that is the point: they still truncate `Function.length`, which is the known issue this test pins.
      map((_value: number, _index = 0, data: readonly number[] = []) => data),
    );

    // `Function.length` stops counting at the first parameter with a
    // default, so this callback reports 1 and `pipe` hands it the shared
    // empty array instead of buffering; the default never fires because an
    // argument is always passed.
    expect(result).toStrictEqual([[], [], []]);
  });

  test("`arguments` access hides `data` from the arity check", () => {
    const result = pipe(
      [1, 2, 3],
      map(function readsArguments(_value: number) {
        // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment -- The point of this test is that arguments-based access is invisible to the arity check, and `arguments` is untyped by construction so spreading it is unavoidably unsafe here.
        return [...arguments[2]];
      }),
    );

    // A `function` expression that reaches for `arguments` instead of
    // declaring `data` also reports a `length` of 1, so `pipe` hands it the
    // shared empty array instead of buffering.
    expect(result).toStrictEqual([[], [], []]);
  });

  test("a trailing rest parameter hides `data` from the arity check", () => {
    const result = pipe(
      [1, 2, 3],
      map(
        (
          _value: number,
          _index: number,
          ...rest: readonly [readonly number[]]
        ) => [...rest[0]],
      ),
    );

    // `Function.length` counts only the named parameters before a rest
    // parameter, so this callback reports 2 and `pipe` doesn't buffer;
    // `rest[0]` is the shared frozen empty array on every call.
    expect(result).toStrictEqual([[], [], []]);
  });
});
