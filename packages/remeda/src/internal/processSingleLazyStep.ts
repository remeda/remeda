/* eslint-disable unicorn/no-break-in-nested-loop --
 * The `break`s inside the `switch` only end their case; the loop itself is
 * left by the `isDone` check, which sits outside the `switch`.
 */

import { isLazyControl } from "./lazyControl";
import { UNEXPECTED_ACCESS_SENTINEL } from "./requireData";
import type { LazyDefinition } from "./types/LazyDefinition";

/**
 * Runs an iterable through a single lazy step, skipping the step objects and
 * the fan-out recursion that the general path in `pipe` needs.
 *
 * @param iterable - The data to run through the step.
 * @param lazy - The lazy implementation the step's evaluator is built from.
 * @param lazyArgs - The arguments the evaluator is built with.
 * @see pipe
 */
export function processSingleLazyStep(
  iterable: Iterable<unknown>,
  lazy: LazyDefinition["lazy"],
  lazyArgs: LazyDefinition["lazyArgs"],
): unknown {
  const lazyEvaluator = lazy(...lazyArgs);

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
        break;
      }
    } else {
      // The common case: the evaluator emitted an item.
      accumulator.push(result);
    }
  }

  return lazy.single ? accumulator[0] : accumulator;
}
