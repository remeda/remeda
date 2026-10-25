import { describe, test } from "vitest";
import { LAST, MANY, STOP, lastLazyValue, manyLazyValues } from "./lazyControl";
import type {
  LazyEvaluator,
  StoppableLazyEvaluator,
} from "./types/LazyEvaluator";

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

  test("many with values of the result type", () => {
    numberEvaluator((value, _index, _data, slot) =>
      manyLazyValues([value], slot),
    );
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

  test("a direct write to the slot", () => {
    numberEvaluator((value, _index, _data, slot) => {
      // @ts-expect-error [ts2540] -- Only the helpers write the payload, so it
      // always comes with the control that tells the pipe to read it.
      slot.value = value;
      return value;
    });
  });

  test("a bare many", () => {
    numberEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- The payload travels in the slot, so only
        // `manyLazyValues`, which writes one, may produce the control.
        MANY,
    );
  });

  test("last with a value of another type", () => {
    stoppableNumberEvaluator((_value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- The control's tag carries the payload's
      // type, so the pipe never reads a value the evaluator didn't declare.
      lastLazyValue("x", slot),
    );
  });

  test("many with values of another type", () => {
    numberEvaluator((_value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- The control's tag carries the payload's
      // type, so the pipe never reads values the evaluator didn't declare.
      manyLazyValues(["x"], slot),
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
});
