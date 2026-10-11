import { describe, test } from "vitest";
import {
  LAST,
  MANY,
  SKIP_ITEM,
  STOP,
  lastLazyValue,
  manyLazyValues,
} from "./lazyControl";
import { requireData } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

// Stands in for a lazy implementation's declared result type, which is what
// checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;

describe("accepted", () => {
  test("the item", () => {
    numberEvaluator((value) => value);
  });

  test("skip", () => {
    numberEvaluator(() => SKIP_ITEM);
  });

  test("stop", () => {
    numberEvaluator(() => STOP);
  });

  test("last with a value of the result type", () => {
    numberEvaluator((value, _index, _data, slot) => lastLazyValue(value, slot));
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

  test("an evaluator marked with `requireData` returning another type", () => {
    numberEvaluator(
      requireData(
        () =>
          // @ts-expect-error [ts2322] -- `requireData` takes its types from
          // the declared evaluator type alone, so the mismatch is reported at
          // the evaluator's own return expression.
          "x",
      ),
    );
  });
});
