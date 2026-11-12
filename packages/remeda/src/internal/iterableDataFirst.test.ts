/* eslint-disable unicorn/consistent-function-scoping --
 * A lazy implementation is a factory that returns its evaluator, so these tests
 * nest functions that capture nothing; each evaluator stays inline to read next
 * to its assertion.
 */

import { describe, expect, test, vi } from "vitest";
import { iterableDataFirst } from "./iterableDataFirst";
import { manyLazyValues, SKIP_ITEM } from "./lazyControl";
import { makeReducing } from "./makeReducing";
import {
  lastLazyValue,
  makeStoppable,
  STOP,
  type StoppableLazyEvaluator,
} from "./makeStoppable";
import { requireData } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

test("builds the evaluator with the lazy argument", () => {
  const lazy = vi.fn<(lazyArgument: readonly unknown[]) => LazyEvaluator>(
    () => (value) => value,
  );
  iterableDataFirst([], lazy, [1, "a"]);

  expect(lazy).toHaveBeenCalledExactlyOnceWith([1, "a"]);
});

describe("input", () => {
  test("empty", () => {
    expect(iterableDataFirst([], () => (value) => value, [])).toStrictEqual([]);
  });

  test("a string is iterated by character", () => {
    expect(iterableDataFirst("abc", () => (value) => value, [])).toStrictEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("a generator is pulled only until done", () => {
    expect(
      iterableDataFirst(
        naturals(),
        makeStoppable(
          () => (value, index, _data, slot) =>
            index === 2 ? lastLazyValue(value, slot) : value,
        ),
        [],
      ),
    ).toStrictEqual([0, 1, 2]);
  });

  test("a generator is closed when done", () => {
    const onClose = vi.fn<() => void>();
    iterableDataFirst(
      closesWith(onClose),
      makeStoppable(() => () => STOP),
      [],
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("items", () => {
  test.each([null, undefined, 0, "", false])("%s is emitted", (item) => {
    expect(iterableDataFirst([item], () => (value) => value, [])).toStrictEqual(
      [item],
    );
  });

  test("a symbol is emitted", () => {
    const item = Symbol("item");

    expect(iterableDataFirst([0], () => () => item, [])).toStrictEqual([item]);
  });

  test("are never probed", () => {
    // A revoked proxy throws on every trap, so the item survives only if
    // nothing but its identity was used.
    const { proxy: item, revoke } = Proxy.revocable({}, {});
    revoke();
    // @ts-expect-error [ts2488] -- `iterableDataFirst` returns `unknown` because a reducing step returns its single value; this step isn't reducing, so the result is the array of collected items.
    const [result] = iterableDataFirst([item], () => (value) => value, []);

    expect(result).toBe(item);
  });
});

describe("data", () => {
  test("the items so far when required", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        (): LazyEvaluator => requireData((_value, _index, data) => [...data]),
        [],
      ),
    ).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
  });

  test("the sentinel when not required", () => {
    const evaluator = vi.fn<LazyEvaluator>((value) => value);
    iterableDataFirst([1, 2, 3], () => evaluator, []);

    // Asserting identity with `toBe` would make the matcher format the sentinel
    // on failure, which throws and hides the real mismatch.
    expect(() => evaluator.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
  });
});

describe("skipping an item", () => {
  test("drops it", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        () => (value) => (value === 2 ? SKIP_ITEM : value),
        [],
      ),
    ).toStrictEqual([1, 3]);
  });

  test("still advances the index", () => {
    expect(
      iterableDataFirst(
        ["a", "b", "c", "d", "e"],
        () => (_value, index) => (index % 2 === 0 ? index : SKIP_ITEM),
        [],
      ),
    ).toStrictEqual([0, 2, 4]);
  });
});

describe("fanning out an item", () => {
  test("emits every sub-item", () => {
    expect(
      iterableDataFirst(
        [1, 2],
        () => (value, _index, _data, slot) =>
          manyLazyValues([value, "sub-item"], slot),
        [],
      ),
    ).toStrictEqual([1, "sub-item", 2, "sub-item"]);
  });

  test("to nothing drops it", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        () => (value, _index, _data, slot) =>
          manyLazyValues(value === 2 ? [] : [value], slot),
        [],
      ),
    ).toStrictEqual([1, 3]);
  });

  test("to more sub-items than a call can take arguments emits them all", () => {
    const subItems = Array.from({ length: 500_000 }, (_item, index) => index);

    expect(
      iterableDataFirst(
        [0],
        () => (_value, _index, _data, slot) => manyLazyValues(subItems, slot),
        [],
      ),
    ).toHaveLength(500_000);
  });

  test("advances the index once", () => {
    expect(
      iterableDataFirst(
        ["a", "b"],
        () => (value, index, _data, slot) =>
          manyLazyValues([value, index], slot),
        [],
      ),
    ).toStrictEqual(["a", 0, "b", 1]);
  });
});

describe("stopping", () => {
  test("emits nothing for the item", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        makeStoppable(() => (value) => (value === 2 ? STOP : value)),
        [],
      ),
    ).toStrictEqual([1]);
  });

  test("ends the iteration", () => {
    const evaluator = vi.fn<StoppableLazyEvaluator>(() => STOP);
    iterableDataFirst(
      [1, 2, 3],
      makeStoppable(() => evaluator),
      [],
    );

    expect(evaluator).toHaveBeenCalledTimes(1);
  });
});

describe("stopping with a last value", () => {
  test("emits it", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        makeStoppable(
          () => (value, _index, _data, slot) =>
            value === 2 ? lastLazyValue("last", slot) : value,
        ),
        [],
      ),
    ).toStrictEqual([1, "last"]);
  });

  test("ends the iteration", () => {
    const evaluator = vi.fn<StoppableLazyEvaluator>(
      (value, _index, _data, slot) => lastLazyValue(value, slot),
    );
    iterableDataFirst(
      [1, 2, 3],
      makeStoppable(() => evaluator),
      [],
    );

    expect(evaluator).toHaveBeenCalledTimes(1);
  });
});

describe("reducing", () => {
  test("unwraps to the emitted value", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        makeReducing(
          makeStoppable(
            () => (value, _index, _data, slot) =>
              value === 2 ? lastLazyValue(value, slot) : SKIP_ITEM,
          ),
        ),
        [],
      ),
    ).toBe(2);
  });

  test("unwraps to `undefined` when nothing was emitted", () => {
    expect(
      iterableDataFirst(
        [1, 2, 3],
        makeReducing(() => () => SKIP_ITEM),
        [],
      ),
    ).toBeUndefined();
  });

  test("unwraps to `undefined` on an empty input", () => {
    expect(
      iterableDataFirst(
        [],
        makeReducing(() => (value) => value),
        [],
      ),
    ).toBeUndefined();
  });
});

// Never finishes on its own, so only a loop that stops pulling can consume it.
function* naturals(): Generator<number> {
  for (let value = 0; ; value++) {
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
