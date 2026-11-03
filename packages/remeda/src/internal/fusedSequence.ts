import type { UnaryFunction } from "./dataLastImplementation";
import { createLazySlot, MANY, SKIP_ITEM, type LazySlot } from "./lazyControl";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import { LAST, STOP, type StoppableLazyEvaluator } from "./makeStoppable";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

type LazyStep = {
  // `LazyEvaluator`s are also `StoppableLazyEvaluator`s so this accepts both.
  readonly lazyEvaluator: StoppableLazyEvaluator;
  index: number;
} & (
  | {
      readonly requiresData: true;
      // Notice the array is mutable, we will be adding items as the pipe is
      // evaluating them. It is shared with every invocation of the evaluator.
      readonly items: unknown[];
    }
  | {
      readonly requiresData: false;
      readonly items: typeof UNEXPECTED_ACCESS_SENTINEL;
    }
);

export function buildFusedSequence(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
): readonly LazyStep[] {
  const fusedSequence: LazyStep[] = [];

  for (let index = startIndex; index < functions.length; index++) {
    const func = functions[index]!;
    if (!("lazy" in func)) {
      break;
    }

    const lazyEvaluator = func.lazy(...func.lazyArgs);
    fusedSequence.push(
      lazyEvaluator.requiresData
        ? {
            lazyEvaluator,
            index: 0,
            requiresData: true,
            items: [],
          }
        : {
            lazyEvaluator,
            index: 0,
            requiresData: false,
            items: UNEXPECTED_ACCESS_SENTINEL,
          },
    );

    if (func.lazy.isReducing) {
      // Functions that reduce to a value always end the sequence.
      break;
    }
  }

  return fusedSequence;
}

export function runFusedSequence(
  input: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
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

    // eslint-disable-next-line unicorn/no-duplicate-if-branches -- Intentional! Identical on purpose. In V8, a `for...of` that has only ever seen arrays skips the iterator protocol; each loop is its own iteration site, which is what lets the compiler specialize the first one for arrays, that sets, strings and generators never reach.
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

function processItem(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  fusedSequence: readonly LazyStep[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, we use `output` directly to accumulate the results.
  accumulator: unknown[],
  item: unknown,
  slot: LazySlot,
  startIndex: number,
): boolean {
  let currentItem = item;
  let isDone = false;
  for (
    let stepIndex = startIndex;
    stepIndex < fusedSequence.length;
    stepIndex++
  ) {
    const step = fusedSequence[stepIndex]!;

    if (step.requiresData) {
      step.items.push(currentItem);
    }

    // Pull the evaluator out of the step to nullify its `this`.
    const { lazyEvaluator } = step;
    const result = lazyEvaluator(currentItem, step.index, step.items, slot);

    step.index += 1;

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
