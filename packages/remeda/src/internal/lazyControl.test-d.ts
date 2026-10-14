import { describe, test } from "vitest";
import { LAST, MANY, lastLazyValue, manyLazyValues } from "./lazyControl";
import type { LazyEvaluator } from "./types/LazyEvaluator";

// Stands in for a lazy implementation's declared result type, which is what
// checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;

// Stands in for a lazy implementation that is generic over its items, which is
// how most utilities declare their evaluator's result type.
declare function genericEvaluator(
  evaluator: <T>(
    ...args: Readonly<Parameters<LazyEvaluator<T>>>
  ) => ReturnType<LazyEvaluator<T>>,
): void;

// Stands in for an evaluator declared without a result type, which
// `LazyEvaluator`'s defaults make `unknown`.
declare function unknownEvaluator(evaluator: LazyEvaluator): void;

describe("accepted", () => {
  test("last with a value of the result type", () => {
    numberEvaluator((value, _index, _data, slot) => lastLazyValue(value, slot));
  });

  test("last with a value of a generic result type", () => {
    genericEvaluator((value, _index, _data, slot) =>
      lastLazyValue(value, slot),
    );
  });

  test("many with values of the result type", () => {
    numberEvaluator((value, _index, _data, slot) =>
      manyLazyValues([value], slot),
    );
  });
});

describe("rejected", () => {
  test("a bare last", () => {
    numberEvaluator(
      () =>
        // @ts-expect-error [ts2322] -- The payload travels in the slot, so only
        // `lastLazyValue`, which writes one, may produce the control.
        LAST,
    );
  });

  test("a bare last with a generic result type", () => {
    genericEvaluator(
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
    numberEvaluator((_value, _index, _data, slot) =>
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
});

describe("known issues!", () => {
  test("a bare last with an unknown result type", () => {
    // `LazyResult<unknown>` collapses to `unknown`, which accepts any value,
    // including a control without its payload. `flat`'s evaluators are typed
    // this way because their item type changes with depth.
    unknownEvaluator(() => LAST);
  });
});
