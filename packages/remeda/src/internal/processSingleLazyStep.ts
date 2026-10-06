/* eslint-disable unicorn/no-break-in-nested-loop --
 * Every `break` here ends a `switch` case; the loop is only left via `return`.
 */

import { isLazyControl } from "./lazyControl";
import { UNEXPECTED_ACCESS_SENTINEL } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

/**
 * Runs an iterable through a single lazy step, skipping the step objects and
 * the fan-out recursion that the general path in `pipe` needs.
 *
 * @param iterable - The data to run through the step.
 * @param lazyEvaluator - The step, already built from its lazy arguments.
 * @see pipe
 */
export function processSingleLazyStep(
  iterable: Iterable<unknown>,
  lazyEvaluator: LazyEvaluator,
): unknown[] {
  // `dataBuffer` exists only when the evaluator requires `data`, so it doubles
  // as the flag for filling it; every other evaluator sees
  // `UNEXPECTED_ACCESS_SENTINEL`.
  const dataBuffer: unknown[] | undefined = lazyEvaluator.requiresData
    ? []
    : undefined;
  const items = dataBuffer ?? UNEXPECTED_ACCESS_SENTINEL;

  const accumulator: unknown[] = [];
  let index = 0;

  for (const value of iterable) {
    dataBuffer?.push(value);

    const result = lazyEvaluator(value, index, items);
    index += 1;

    if (isLazyControl(result)) {
      switch (result.control) {
        case "many":
          for (const subItem of result.value) {
            // Pushed one by one rather than spread, so a large fan-out can't
            // hit the argument-count limit.
            accumulator.push(subItem);
          }
          break;

        case "last":
          accumulator.push(result.value);
          break;

        case "skip":
          // do nothing
          break;
      }

      if (result.isDone) {
        return accumulator;
      }
    } else {
      // The common case: the evaluator emitted an item.
      accumulator.push(result);
    }
  }

  return accumulator;
}
