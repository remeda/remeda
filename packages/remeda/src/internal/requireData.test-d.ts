import { test } from "vitest";
import { requireData } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

// Stands in for a lazy implementation's declared result type, which is what
// checks the evaluator it returns.
declare function numberEvaluator(evaluator: LazyEvaluator<number>): void;

test("an evaluator returning another type", () => {
  // TODO [>2]: Split the evaluator onto its own lines so the directive pins the error to its return expression. Our `NoInfer` polyfill doesn't block inference the way the native one (TypeScript 5.4) does, so on older versions the error lands on the `requireData` call instead.
  // @ts-expect-error [ts2322] -- The evaluator returns a string where the declared evaluator type expects a number.
  numberEvaluator(requireData(() => "x"));
});
