/* eslint-disable unicorn/no-break-in-nested-loop --
 * This allows us a cleaner structure for handling the lazy control construct's
 * `control` values.
 */

import { isLazyControl } from "./lazyControl";
import { UNEXPECTED_ACCESS_SENTINEL } from "./requireData";
import type { LazyEvaluator } from "./types/LazyEvaluator";

/**
 * A stripped down version of the general `pipe` for cases where there is only
 * one consecutive lazy step; where all items reach the output immediately, and
 * thus don't need extra boilerplate to hold them in temporary buffers.
 *
 * @param iterable - The data to run through the step.
 * @param lazyEvaluator - The step, already built from its lazy arguments.
 * @see pipe
 */
export function processSingleLazyStep(
  iterable: Iterable<unknown>,
  lazyEvaluator: LazyEvaluator,
): unknown[] {
  // Only a step that reads `data` gets a buffer of its own; everyone else gets
  // `UNEXPECTED_ACCESS_SENTINEL`, which also makes the buffer the flag for
  // whether there is anything to fill.
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
