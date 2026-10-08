import { createLazySlot, LAST, MANY, SKIP_ITEM, STOP } from "./lazyControl";
import type { LazyDefinition } from "./types/LazyDefinition";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

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

  const slot = createLazySlot();
  const accumulator: unknown[] = [];
  let index = 0;

  for (const value of iterable) {
    dataBuffer?.push(value);

    const result = lazyEvaluator(value, index, items, slot);
    index += 1;

    // Every control is a symbol, so an item of any other type skips the
    // comparisons below with this one check.
    if (typeof result === "symbol") {
      if (result === SKIP_ITEM) {
        continue;
      }

      if (result === MANY) {
        for (const subItem of slot.values) {
          // Pushed one by one rather than spread, so a large fan-out can't
          // hit the argument-count limit.
          accumulator.push(subItem);
        }
        continue;
      }

      if (result === LAST) {
        accumulator.push(slot.value);
        break;
      }

      if (result === STOP) {
        break;
      }
    }

    // The common case: the evaluator emitted an item.
    accumulator.push(result);
  }

  return lazy.single ? accumulator[0] : accumulator;
}
