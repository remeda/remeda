import { describe, test } from "vitest";
import { STOP, lastLazyValue } from "./lazyControl";
import { requireData, requireDataByArity } from "./requireData";
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

// Stands in for the user's callback, whose arity `requireDataByArity` reads.
declare function callback(
  value: number,
  index: number,
  data: readonly number[],
): boolean;

describe("accepted", () => {
  test("an evaluator that can stop", () => {
    stoppableNumberEvaluator(
      requireData((value, _index, _data, slot) => lastLazyValue(value, slot)),
    );
  });

  test("an evaluator that can stop, by arity", () => {
    stoppableNumberEvaluator(
      requireDataByArity(callback, (value, _index, _data, slot) =>
        lastLazyValue(value, slot),
      ),
    );
  });
});

describe("rejected", () => {
  test("an evaluator returning another type", () => {
    numberEvaluator(
      requireData(
        () =>
          // @ts-expect-error [ts2322] -- The evaluator returns a string where
          // the declared evaluator type expects a number.
          "x",
      ),
    );
  });

  test("stop from an evaluator that can't stop", () => {
    numberEvaluator(
      requireData(
        () =>
          // @ts-expect-error [ts2322] -- `requireData` returns the declared
          // evaluator type unchanged, and that type can't stop.
          STOP,
      ),
    );
  });

  test("stop from an evaluator that can't stop, by arity", () => {
    numberEvaluator(
      requireDataByArity(
        callback,
        () =>
          // @ts-expect-error [ts2322] -- `requireDataByArity` returns the
          // declared evaluator type unchanged, and that type can't stop.
          STOP,
      ),
    );
  });
});
