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
      readonly requiresData: true;
      // Mutable: each item is appended before the evaluator reads the array as
      // its `data` argument, and every invocation shares it.
      readonly data: unknown[];
    }
  | {
      readonly requiresData: false;
      readonly data: typeof UNEXPECTED_ACCESS_SENTINEL;
    }
);

/**
 * Builds the steps for the sequence of lazy functions that starts at
 * `startIndex`: the consecutive lazy functions, ending after the first reducing
 * one.
 */
export function buildFusedSequence(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
): readonly LazyStep[] {
  const fusedSequence: LazyStep[] = [];

  for (let index = startIndex; index < functions.length; index++) {
    const currentFunction = functions[index]!;
    if (!("lazy" in currentFunction)) {
      break;
    }

    const lazyEvaluator = currentFunction.lazy(...currentFunction.lazyArgs);
    fusedSequence.push(
      lazyEvaluator.requiresData
        ? {
            lazyEvaluator,
            itemIndex: 0,
            requiresData: true,
            data: [],
          }
        : {
            lazyEvaluator,
            itemIndex: 0,
            requiresData: false,
            data: UNEXPECTED_ACCESS_SENTINEL,
          },
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
 * @returns The items that left the last step; the caller unwraps a reducing
 * step's value.
 */
export function runFusedSequence(
  input: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the data buffer and the item index) to avoid per-item allocations.
  fusedSequence: readonly LazyStep[],
): unknown[] {
  const accumulator: unknown[] = [];
  const slot = createLazySlot();

  if (Array.isArray(input)) {
    // Iterated rather than indexed, so a reactive array that instruments
    // iteration tracks one dependency instead of one per index.
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
  let currentItem = item;
  let isDone = false;
  for (
    let stepIndex = firstStepIndex;
    stepIndex < fusedSequence.length;
    stepIndex++
  ) {
    const step = fusedSequence[stepIndex]!;

    if (step.requiresData) {
      step.data.push(currentItem);
    }

    // Pull the evaluator out of the step to nullify its `this`.
    const { lazyEvaluator } = step;
    const result = lazyEvaluator(currentItem, step.itemIndex, step.data, slot);

    step.itemIndex += 1;

    // Every control is a symbol, so an item of any other type skips the
    // comparisons below with this one check.
    if (typeof result === "symbol") {
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
