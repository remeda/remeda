import { test } from "vitest";
import { requireData } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

// Stands in for a lazy implementation's declared result type, which is what
// checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;

test("an evaluator returning the declared type", () => {
  numberEvaluator(requireData((value) => value));
});

test("an evaluator returning another type", () => {
  numberEvaluator(
    requireData(
      () =>
        // @ts-expect-error [ts2322] -- `requireData` takes its types from the
        // declared evaluator type alone, so the mismatch is reported at the
        // evaluator's own return expression.
        "x",
    ),
  );
});
