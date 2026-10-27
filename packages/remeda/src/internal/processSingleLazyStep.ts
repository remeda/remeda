import { createLazySlot, MANY, SKIP_ITEM, type LazySlot } from "./lazyControl";
import type { LazyEvaluatorFactory } from "./lazyDataLastImplementation";
import { LAST, STOP } from "./makeStoppable";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

/**
 * Runs an iterable through a single lazy step, skipping the step objects and
 * the fan-out recursion that the general path in `pipe` needs. `pipe` never
 * calls it for an array.
 *
 * @param input - The data to run through the step.
 * @param lazy - The lazy implementation the step's evaluator is built from.
 * @param lazyArgs - The arguments the evaluator is built with.
 * @see pipe
 */
export function processSingleLazyStep<P extends readonly unknown[]>(
  input: Iterable<unknown>,
  lazy: LazyEvaluatorFactory<readonly unknown[], P>,
  lazyArgs: P,
): unknown {
  const lazyEvaluator = lazy(...lazyArgs);

  // `dataBuffer` exists only when the evaluator requires `data`, so it doubles
  // as the flag for filling it.
  const dataBuffer = lazyEvaluator.requiresData ? ([] as unknown[]) : undefined;
  const items = dataBuffer ?? UNEXPECTED_ACCESS_SENTINEL;

  const slot = createLazySlot();
  const accumulator: unknown[] = [];
  let index = 0;

  for (const value of input) {
    dataBuffer?.push(value);

    const isDone = collect(
      lazyEvaluator(value, index, items, slot),
      accumulator,
      slot,
    );
    index += 1;
    if (isDone) {
      break;
    }
  }

  return lazy.isReducing ? accumulator[0] : accumulator;
}

/**
 * Adds whatever the evaluator emitted for one item to `accumulator`.
 *
 * @returns Whether the evaluator is done.
 */
function collect(
  result: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, the results are accumulated into it directly.
  accumulator: unknown[],
  slot: LazySlot,
): boolean {
  // Every control is a symbol, so an item of any other type skips the
  // comparisons below with this one check.
  if (typeof result === "symbol") {
    if (result === SKIP_ITEM) {
      return false;
    }

    if (result === MANY) {
      for (const subItem of slot.values) {
        // Pushed one by one rather than spread, so a large fan-out can't hit
        // the argument-count limit.
        accumulator.push(subItem);
      }
      return false;
    }

    if (result === LAST) {
      accumulator.push(slot.value);
      return true;
    }

    if (result === STOP) {
      return true;
    }
  }

  // The common case: the evaluator emitted an item.
  accumulator.push(result);
  return false;
}
