/* eslint-disable unicorn/consistent-function-scoping --
 * A lazy implementation is a factory that returns its evaluator, so these
 * tests nest functions that capture nothing; type tests never run them.
 */

import { describe, test } from "vitest";
import { $typed } from "../../test/$typed";
import type { LazyResult, LazySlot } from "./lazyControl";
import type { LazyDefinition } from "./lazyDataLastImplementation";
import {
  LAST,
  lastLazyValue,
  lazyEmptyEvaluator,
  makeStoppable,
  STOP,
  type StoppableResult,
} from "./makeStoppable";
import type {
  LazyEvaluator,
  StoppableLazyEvaluator,
} from "./types/LazyEvaluator";

declare function acceptLazy(
  lazy: LazyDefinition<readonly unknown[], readonly []>["lazy"],
): void;

// Both stand in for the evaluator type a lazy implementation declares as its
// return type, which is what checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;
declare function stoppableNumberEvaluator(
  evaluator: StoppableLazyEvaluator<number>,
): void;

// Both stand in for a lazy implementation that is generic over its items,
// which is how most utilities declare their evaluator's result type.
declare function genericEvaluator(
  evaluator: <T>(
    ...args: Readonly<Parameters<LazyEvaluator<T>>>
  ) => ReturnType<LazyEvaluator<T>>,
): void;
declare function stoppableGenericEvaluator(
  evaluator: <T>(
    ...args: Readonly<Parameters<StoppableLazyEvaluator<T>>>
  ) => ReturnType<StoppableLazyEvaluator<T>>,
): void;

// Stands in for an evaluator declared without a result type, which
// `LazyEvaluator`'s defaults make `unknown`.
declare function unknownEvaluator(evaluator: LazyEvaluator): void;

describe("accepted", () => {
  test("last with a value of the result type", () => {
    stoppableNumberEvaluator((value, _index, _data, slot) =>
      lastLazyValue(value, slot),
    );
  });

  test("last with a value of a generic result type", () => {
    stoppableGenericEvaluator((value, _index, _data, slot) =>
      lastLazyValue(value, slot),
    );
  });

  test("stop", () => {
    stoppableNumberEvaluator(() => STOP);
  });

  test("an evaluator that can't stop, without the mark", () => {
    acceptLazy((): LazyEvaluator => (value) => value);
  });

  test("an evaluator that can stop, with the mark", () => {
    acceptLazy(
      makeStoppable(
        (): StoppableLazyEvaluator => (value, _index, _data, slot) =>
          lastLazyValue(value, slot),
      ),
    );
  });

  test("the empty evaluator, with the mark", () => {
    acceptLazy(makeStoppable(() => lazyEmptyEvaluator));
  });
});

describe("rejected", () => {
  test("a bare last", () => {
    stoppableNumberEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- The payload travels in the slot, so only
        // `lastLazyValue`, which writes one, may produce the control.
        LAST,
    );
  });

  test("a bare last with a generic result type", () => {
    stoppableGenericEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- The payload travels in the slot, so only
        // `lastLazyValue`, which writes one, may produce the control.
        LAST,
    );
  });

  test("last with a value of another type", () => {
    stoppableNumberEvaluator((_value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- The control's tag carries the payload's
      // type, so the pipe never reads a value the evaluator didn't declare.
      lastLazyValue("x", slot),
    );
  });

  test("last from an evaluator that can't stop", () => {
    numberEvaluator((value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- Stopping takes a `StoppableLazyEvaluator`,
      // which only a lazy implementation marked by `makeStoppable` may return.
      lastLazyValue(value, slot),
    );
  });

  test("last from a generic evaluator that can't stop", () => {
    genericEvaluator((value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- Stopping takes a `StoppableLazyEvaluator`,
      // which only a lazy implementation marked by `makeStoppable` may return.
      lastLazyValue(value, slot),
    );
  });

  test("stop from an evaluator that can't stop", () => {
    numberEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- Stopping takes a
        // `StoppableLazyEvaluator`, which only a lazy implementation marked by
        // `makeStoppable` may return.
        STOP,
    );
  });

  test("stop from a generic evaluator that can't stop", () => {
    genericEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- Stopping takes a
        // `StoppableLazyEvaluator`, which only a lazy implementation marked by
        // `makeStoppable` may return.
        STOP,
    );
  });

  test("an evaluator that can stop, without the mark", () => {
    acceptLazy(
      // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
      // the mark, so without one the evaluator can't stop it early.
      (): StoppableLazyEvaluator => (value, _index, _data, slot) =>
        lastLazyValue(value, slot),
    );
  });

  test("the empty evaluator, without the mark", () => {
    // @ts-expect-error [ts2345] -- `pipe` fuses a run over an array only for
    // the mark, so without one the evaluator can't stop it early.
    acceptLazy(() => lazyEmptyEvaluator);
  });
});

describe("known issues!", () => {
  test("a bare last with an unknown result type", () => {
    // `LazyResult<unknown>` collapses to `unknown`, which accepts any value,
    // including a control without its payload, and, since `LAST` stops, a stop
    // from an evaluator that can't stop. `flat`'s evaluators are typed this way
    // because their item type changes with depth.
    unknownEvaluator(() => LAST);
  });

  test("stop from an evaluator that can't stop, with an unknown result type", () => {
    // The same collapse accepts a stop from an evaluator that can't stop.
    unknownEvaluator(() => STOP);
  });

  test("an evaluator that can't stop, with the mark", () => {
    // Every `LazyEvaluator` is also a `StoppableLazyEvaluator` (one that may
    // stop doesn't have to), so the mark is accepted where nothing stops. A
    // needless mark only costs a fused run that nothing stops early.
    acceptLazy(makeStoppable((): LazyEvaluator => (value) => value));
  });

  test("an evaluator of neither type that stops, without the mark", () => {
    // Only the two evaluator types tell the kinds apart: an evaluator typed any
    // other way is neither, and the `unknown` result type that the `lazy` prop
    // checks evaluators with accepts its stop.
    acceptLazy(() => () => STOP);
  });

  test("the empty evaluator next to an evaluator of neither type, without the mark", () => {
    // TypeScript reduces the union of the two to the evaluator of neither type,
    // which `lazyEmptyEvaluator` is a subtype of, so its kind is lost too.
    acceptLazy(() => ($typed<boolean>() ? emitAndStop : lazyEmptyEvaluator));
  });
});

// Typed by its result rather than as one of the two evaluator types.
const emitAndStop = <T>(
  value: T,
  _index: number,
  _data: readonly T[],
  slot: LazySlot,
): LazyResult<T> | StoppableResult<T> => lastLazyValue(value, slot);
