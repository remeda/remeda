/* eslint-disable unicorn/consistent-function-scoping --
 * A lazy implementation is a factory that returns its evaluator, so these
 * tests nest functions that capture nothing; type tests never run them.
 */

import { describe, test } from "vitest";
import {
  STOP,
  lastLazyValue,
  lazyEmptyEvaluator,
  type LazySlot,
  type StoppableLazyResult,
} from "./lazyControl";
import type { LazyDefinition } from "./lazyDataLastImplementation";
import { makeReducing } from "./makeReducing";
import { makeStoppable } from "./makeStoppable";
import type {
  LazyEvaluator,
  StoppableLazyEvaluator,
} from "./types/LazyEvaluator";

// Stands in for the lazy implementation that `purryWithLazy` takes, which sees
// the items of a utility that is generic over its data as `unknown`.
declare function lazyImplementation(
  lazy: LazyDefinition<readonly unknown[], readonly []>["lazy"],
): void;

declare const hasItems: boolean;

// Typed by its result rather than as one of the two evaluator types.
const emitAndStop = <T>(
  value: T,
  _index: number,
  _data: readonly T[],
  slot: LazySlot,
): StoppableLazyResult<T> => lastLazyValue(value, slot);

describe("accepted", () => {
  test("an evaluator that can't stop, without the mark", () => {
    lazyImplementation((): LazyEvaluator => (value) => value);
  });

  test("an evaluator that can stop, with the mark", () => {
    lazyImplementation(
      makeStoppable(
        (): StoppableLazyEvaluator => (value, _index, _data, slot) =>
          lastLazyValue(value, slot),
      ),
    );
  });

  test("a generic evaluator that can stop, with the mark", () => {
    lazyImplementation(
      makeStoppable(<T>(): StoppableLazyEvaluator<T> => lazyEmptyEvaluator),
    );
  });

  test("an evaluator that can stop, with the mark, reducing", () => {
    lazyImplementation(
      makeReducing(makeStoppable((): StoppableLazyEvaluator => () => STOP)),
    );
  });

  test("the empty evaluator, with the mark", () => {
    lazyImplementation(makeStoppable(() => lazyEmptyEvaluator));
  });
});

describe("rejected", () => {
  test("an evaluator that can stop, without the mark", () => {
    // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
    // the mark, so without one the evaluator can't stop it early.
    lazyImplementation((): StoppableLazyEvaluator => () => STOP);
  });

  test("a generic evaluator that can stop, without the mark", () => {
    // Passed by name, as utilities do: inline, the error on a generic arrow is
    // reported inside its body instead.
    const unmarked = <T>(): StoppableLazyEvaluator<T> => lazyEmptyEvaluator;
    // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
    // the mark, so without one the evaluator can't stop it early.
    lazyImplementation(unmarked);
  });

  test("an evaluator that can stop, reducing without the mark", () => {
    // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
    // the mark, so without one the evaluator can't stop it early.
    lazyImplementation(makeReducing((): StoppableLazyEvaluator => () => STOP));
  });

  test("the empty evaluator, without the mark", () => {
    // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
    // the mark, so without one the evaluator can't stop it early.
    lazyImplementation(() => lazyEmptyEvaluator);
  });
});

describe("known issues!", () => {
  test("an evaluator that can't stop, with the mark", () => {
    // Every `LazyEvaluator` is also a `StoppableLazyEvaluator` (one that may
    // stop doesn't have to), so the mark is accepted where nothing stops. A
    // needless mark only costs a fused run that nothing stops early.
    lazyImplementation(makeStoppable((): LazyEvaluator => (value) => value));
  });

  test("an evaluator of neither type that stops, without the mark", () => {
    // Only the two evaluator types tell the kinds apart: an evaluator typed any
    // other way is neither, and the `unknown` result type that the `lazy` prop
    // checks evaluators with accepts its stop.
    lazyImplementation(() => () => STOP);
  });

  test("the empty evaluator next to an evaluator of neither type, without the mark", () => {
    // TypeScript reduces the union of the two to the evaluator of neither type,
    // which `lazyEmptyEvaluator` is a subtype of, so its kind is lost too.
    lazyImplementation(() => (hasItems ? emitAndStop : lazyEmptyEvaluator));
  });
});
