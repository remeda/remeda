import { createLazySlot, MANY, SKIP_ITEM, type LazySlot } from "./lazyControl";
import type {
  LazyArgument,
  LazyEvaluatorFactory,
} from "./lazyDataLastImplementation";
import { LAST, STOP } from "./makeStoppable";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

/**
 * Runs a lazy function on an iterable that isn't an array, standing in for its
 * data-first implementation, which only accepts arrays. With a single step
 * there is nothing to fuse, so it skips the step objects and the fan-out
 * recursion of `runFusedSequence`.
 *
 * @param input - The data to run through the step.
 * @param lazy - The lazy implementation the step's evaluator is built from.
 * @param lazyArgument - The argument the evaluator is built with.
 * @see runFusedSequence
 */
export function iterableDataFirst<P extends readonly unknown[]>(
  input: Iterable<unknown>,
  lazy: LazyEvaluatorFactory<readonly unknown[], P>,
  lazyArgument: LazyArgument<P>,
): unknown {
  const lazyEvaluator = lazy(lazyArgument);

  // `dataBuffer` exists only when the evaluator requires `data`, so it doubles
  // as the flag for filling it.
  const dataBuffer: unknown[] | undefined = lazyEvaluator.requiresData
    ? []
    : undefined;
  const data = dataBuffer ?? UNEXPECTED_ACCESS_SENTINEL;

  const slot = createLazySlot();
  const accumulator: unknown[] = [];
  let index = 0;

  for (const item of input) {
    dataBuffer?.push(item);

    const isDone = collect(
      lazyEvaluator(item, index, data, slot),
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
