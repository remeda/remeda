import {
  createLazySlot,
  LAST,
  MANY,
  SKIP_ITEM,
  STOP,
  type LazySlot,
} from "./lazyControl";
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

  if (Array.isArray(iterable)) {
    // A `for...of` that has only ever seen arrays is compiled without the
    // iterator protocol, which the generic loop below can't be, as it also
    // sees sets, strings and generators. Both loops still iterate, so an array
    // that is a proxy (e.g. a reactive store) observes one iteration instead of
    // a read per index.
    for (const value of iterable) {
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
    // eslint-disable-next-line unicorn/no-duplicate-if-branches -- Identical on purpose: each loop is its own iteration site (see above), which is what lets the compiler specialize the first one for arrays.
  } else {
    for (const value of iterable) {
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
  }

  return lazy.single ? accumulator[0] : accumulator;
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
