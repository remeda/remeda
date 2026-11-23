import type { UnaryFunction } from "./dataLastImplementation";
import { createLazySlot, MANY, SKIP_ITEM, type LazySlot } from "./lazyControl";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import { LAST, STOP, type StoppableLazyEvaluator } from "./makeStoppable";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

export type LazyStep = {
  // `LazyEvaluator`s are also `StoppableLazyEvaluator`s so this accepts both.
  readonly lazyEvaluator: StoppableLazyEvaluator;
  itemIndex: number;
} & (
  | {
      readonly collectsData: true;
      // Notice the array is mutable, we will be adding items as the pipe is
      // evaluating them. It is shared with every invocation of the evaluator.
      readonly data: unknown[];
    }
  | {
      readonly collectsData?: never;
      // Nothing to collect: the sentinel, for an evaluator that doesn't
      // require data, or the input itself, for the first step of a sequence
      // that runs on an array.
      readonly data: typeof UNEXPECTED_ACCESS_SENTINEL | readonly unknown[];
    }
);

/**
 * Builds the steps for the sequence of lazy functions that starts at
 * `startIndex`: the consecutive lazy functions, ending after the first reducing
 * one.
 *
 * @param functions - The functions of the pipe.
 * @param startIndex - The index of the first function in the sequence.
 * @param input - The value the sequence will run on. When it is an array, the
 * first step reads it as its `data`.
 * @returns One step per function in the sequence, each with its own fresh
 * evaluator, ready for a single `runFusedSequence` call. The length of the
 * result is the number of functions the sequence covers.
 * @see runFusedSequence
 */
export function buildFusedSequence(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
  input: unknown,
): readonly LazyStep[] {
  const fusedSequence: LazyStep[] = [];

  for (let index = startIndex; index < functions.length; index++) {
    const currentFunction = functions[index]!;
    if (!("lazy" in currentFunction)) {
      // Non-lazy functions cannot be fused.
      break;
    }

    const lazyEvaluator = currentFunction.lazy(currentFunction.lazyArgument);
    fusedSequence.push(
      lazyEvaluator.requiresData
        ? index === startIndex && Array.isArray(input)
          ? // Every item of the input reaches the first step, in order, so an
            // input array already is that step's data, the same as in its
            // data-first call. Any other iterable is collected item by item,
            // like the items that reach a later step.
            { lazyEvaluator, itemIndex: 0, data: input }
          : { lazyEvaluator, itemIndex: 0, data: [], collectsData: true }
        : { lazyEvaluator, itemIndex: 0, data: UNEXPECTED_ACCESS_SENTINEL },
    );

    if (currentFunction.lazy.isReducing) {
      // Functions that reduce to a value always end the sequence.
      break;
    }
  }

  return fusedSequence;
}

/**
 * Runs `input` through the steps one item at a time rather than one function at
 * a time, so a step that stops skips the remaining items in every step.
 *
 * @param input - The iterable to run through the steps.
 * @param fusedSequence - The steps from `buildFusedSequence`. Running them
 * advances their state in place, so they serve this one call only.
 * @returns The items that left the last step; the caller unwraps a reducing
 * step's value.
 * @see buildFusedSequence
 * @see iterableDataFirst
 */
export function runFusedSequence(
  input: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the data buffer and the item index) to avoid per-item allocations.
  fusedSequence: readonly LazyStep[],
): unknown[] {
  const accumulator: unknown[] = [];
  const slot = createLazySlot();

  if (Array.isArray(input)) {
    for (const item of input) {
      const isDone = processItem(fusedSequence, accumulator, item, slot, 0);
      if (isDone) {
        break;
      }
    }

    // eslint-disable-next-line unicorn/no-duplicate-if-branches -- Intentional! Identical on purpose. In V8, a `for...of` that has only ever seen arrays skips the iterator protocol; each loop is its own iteration site, so sets, strings and generators only reach the second, and the compiler can specialize the first for arrays.
  } else {
    // @ts-expect-error [ts18046] -- The overloads only pipe a value into a function that accepts it, and lazy functions only accept iterables.
    for (const item of input) {
      const isDone = processItem(fusedSequence, accumulator, item, slot, 0);
      if (isDone) {
        break;
      }
    }
  }

  return accumulator;
}

/**
 * Feeds `item` through the steps from `firstStepIndex` on, adding what leaves
 * the last step to `accumulator`.
 *
 * @returns Whether the iteration is done.
 */
function processItem(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the data buffer and the item index) to avoid per-item allocations.
  fusedSequence: readonly LazyStep[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, the results are accumulated into it directly.
  accumulator: unknown[],
  item: unknown,
  slot: LazySlot,
  firstStepIndex: number,
): boolean {
  let isDone = false;

  let currentItem = item;
  for (
    let stepIndex = firstStepIndex;
    stepIndex < fusedSequence.length;
    stepIndex++
  ) {
    const step = fusedSequence[stepIndex]!;

    if (step.collectsData) {
      step.data.push(currentItem);
    }

    // Pull the evaluator out of the step to nullify its `this`.
    const { lazyEvaluator } = step;
    const result = lazyEvaluator(currentItem, step.itemIndex, step.data, slot);

    step.itemIndex += 1;

    if (typeof result === "symbol") {
      // Every control is a symbol, so an item of any other type skips the
      // comparisons below with this one check.

      if (result === SKIP_ITEM) {
        return isDone;
      }

      if (result === MANY) {
        for (const subItem of slot.values) {
          if (
            processItem(
              fusedSequence,
              accumulator,
              subItem,
              slot,
              stepIndex + 1,
            )
          ) {
            return true;
          }
        }

        return isDone;
      }

      if (result === LAST) {
        // The last item still goes through the remaining steps.
        currentItem = slot.value;
        isDone = true;
        continue;
      }

      if (result === STOP) {
        return true;
      }
    }

    // The common case: the evaluator emitted an item, hand it to the next
    // step as-is.
    currentItem = result;
  }

  accumulator.push(currentItem);

  return isDone;
}
