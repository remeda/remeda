/* eslint-disable unicorn/consistent-function-scoping --
 * A lazy implementation is a factory that returns its evaluator, so these
 * tests nest functions that capture nothing; type tests never run them.
 */

import { describe, test } from "vitest";
import { $typed } from "../../test/$typed";
import type { LazyResult, LazySlot } from "./lazyControl";
import type { LazyDefinition } from "./lazyDataLastImplementation";
import {
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

describe("accepted", () => {
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
