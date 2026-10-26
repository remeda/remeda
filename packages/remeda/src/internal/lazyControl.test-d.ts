import { describe, test } from "vitest";
import { MANY, manyLazyValues } from "./lazyControl";
import type { LazyEvaluator } from "./types/LazyEvaluator";

// Stands in for the evaluator type a lazy implementation declares as its return
// type, which is what checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;

// Stands in for an evaluator declared without a result type, which
// `LazyEvaluator`'s defaults make `unknown`.
declare function unknownEvaluator(evaluator: LazyEvaluator): void;

describe("accepted", () => {
  test("many with values of the result type", () => {
    numberEvaluator((value, _index, _data, slot) =>
      manyLazyValues([value], slot),
    );
  });
});

describe("rejected", () => {
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

  test("many with values of another type", () => {
    numberEvaluator((_value, _index, _data, slot) =>
      // @ts-expect-error [ts2322] -- The control's tag carries the payload's
      // type, so the pipe never reads values the evaluator didn't declare.
      manyLazyValues(["x"], slot),
    );
  });
});

describe("known issues!", () => {
  test("a bare many with an unknown result type", () => {
    // `LazyResult<unknown>` collapses to `unknown`, which accepts any value,
    // including a control without its payload. `flat`'s evaluators are typed
    // this way because their item type changes with depth.
    unknownEvaluator(() => MANY);
  });
});
