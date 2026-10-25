/* eslint-disable jsdoc/check-param-names --
 * We document pipe's function params as a single parameter entry in the docs.
 */

import type { UnaryFunction } from "./internal/dataLastImplementation";
import {
  createLazySlot,
  LAST,
  MANY,
  SKIP_ITEM,
  STOP,
  type LazySlot,
} from "./internal/lazyControl";
import type { LazyUnaryFunction } from "./internal/lazyDataLastImplementation";
import { processSingleLazyStep } from "./internal/processSingleLazyStep";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { UNEXPECTED_ACCESS_SENTINEL } from "./internal/unexpectedAccessSentinel";

type LazyStep = {
  readonly lazyEvaluator: LazyEvaluator;
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

/**
 * Performs left-to-right function composition, passing data through functions
 * in sequence. Each function receives the output of the previous function,
 * creating a readable top-to-bottom data flow that matches how the
 * transformation is executed. This enables converting deeply nested function
 * calls into clear, sequential steps without temporary variables.
 *
 * When consecutive functions with a `lazy` tag (e.g., `map`, `filter`, `take`,
 * `drop`, `forEach`, etc...) are used together and one of them can end the
 * iteration early (`take`, `find`, `first`, `intersection`, `zip`, `zipWith`),
 * they process data item-by-item rather than creating intermediate arrays.
 * This enables early termination when only partial results are needed,
 * improving performance for large datasets and expensive operations. On
 * arrays, consecutive lazy functions without one of those run one after the
 * other, each the same as its data-first call.
 *
 * Functions are only evaluated lazily when their data-last form is used
 * directly in the pipe. To disable lazy evaluation, use data-first calls via
 * arrow functions: `($) => map($, callback)` instead of `map(callback)`.
 *
 * Any function can be used in pipes, not just Remeda utilities. For creating
 * custom functions that support both data-first and data-last calls, see the
 * `purry` utility.
 *
 * A "headless" variant `piped` is available for creating reusable pipe
 * functions without initial data.
 *
 * IMPORTANT: During lazy evaluation, callbacks using the third parameter (the
 * input array) receive only items processed up to that point, not the complete
 * array, and each item goes through all the lazy functions before the next
 * one is read. On arrays, a lazy function that isn't evaluated together with
 * one that can end the iteration early runs the same as its data-first call:
 * its callbacks receive the complete array, and run for every item before the
 * next function starts.
 *
 * @param data - The input data.
 * @param functions - A sequence of functions that take one argument and
 * return a value.
 * @signature
 *   pipe(data, ...functions);
 * @example
 *    pipe([1, 2, 3], map(multiply(3))); //=> [3, 6, 9]
 *
 *    // = Early termination with lazy evaluation =
 *    pipe(
 *      hugeArray,
 *      map(expensiveComputation),
 *      filter(complexPredicate),
 *      // Only processes items until 2 results are found, then stops.
 *      // Most of hugeArray never gets processed.
 *      take(2),
 *    );
 *
 *    // = Custom logic within a pipe =
 *    pipe(
 *      input,
 *      toLowerCase(),
 *      normalize,
 *      ($) => validate($, CONFIG),
 *      split(","),
 *      unique(),
 *    );
 *
 *    // = Migrating nested transformations to pipes =
 *    // Nested
 *    const result = prop(
 *      mapValues(groupByProp(users, "department"), length()),
 *      "engineering",
 *    );
 *
 *    // Piped
 *    const result = pipe(
 *      users,
 *      groupByProp("department"),
 *      mapValues(length()),
 *      prop("engineering"),
 *    );
 *
 *    // = Using the 3rd param of a callback =
 *    // The following would print out `data` in its entirety for each value
 *    // of `data`, and so would the same `forEach` in a `pipe`, alone or with
 *    // lazy functions that can't end the iteration early (e.g., `map`).
 *    forEach([1, 2, 3, 4], (_item, _index, data) => {
 *      console.log(data);
 *    }); //=> "[1, 2, 3, 4]" logged 4 times
 *
 *    // But when evaluated lazily together with a function that can end the
 *    // iteration early, data would only contain the items up to the current
 *    // index.
 *    pipe(
 *      [1, 2, 3, 4],
 *      forEach((_item, _index, data) => {
 *        console.log(data);
 *      }),
 *      take(3),
 *    ); //=> "[1]", "[1, 2]", "[1, 2, 3]"
 * @dataFirst
 * @category Function
 */
export function pipe<A>(data: A): A;

export function pipe<A, B>(data: A, funcA: (input: A) => B): B;

export function pipe<A, B, C>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
): C;

export function pipe<A, B, C, D>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
): D;

export function pipe<A, B, C, D, E>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
): E;

export function pipe<A, B, C, D, E, F>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
): K;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
): L;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
): M;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
): N;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
  funcN: (input: N) => O,
): O;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  data: A,
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
  funcN: (input: N) => O,
  funcO: (input: O) => P,
): P;

export function pipe(
  input: unknown,
  ...functions: readonly (UnaryFunction | LazyUnaryFunction)[]
): unknown {
  if (functions.length === 0) {
    return input;
  }

  if (functions.length === 1) {
    // The most common pipe, a single function, skips the loop below. A lone
    // lazy function has nothing to fuse with, so an array is passed to it
    // directly, which runs its data-first implementation; only the other
    // iterables, which those implementations don't accept, need the lazy
    // runner.
    const func = functions[0]!;
    return "lazy" in func && !Array.isArray(input)
      ? processSingleLazyStep(
          // @ts-expect-error [ts2345] -- The overloads only pipe a value into a function that accepts it, and lazy functions only accept iterables.
          input,
          func.lazy,
          func.lazyArgs,
        )
      : // @ts-expect-error [ts2345] -- A lazy function only gets here with an array, which every lazy function accepts, but TypeScript can't narrow `func` from a check on `input`.
        func(input);
  }

  let output = input;
  let functionIndex = 0;
  while (functionIndex < functions.length) {
    const func = functions[functionIndex]!;
    if (!("lazy" in func)) {
      output = func(output);
      functionIndex += 1;
      continue;
    }

    const nextFunc = functions[functionIndex + 1];
    if (
      nextFunc === undefined ||
      !("lazy" in nextFunc) ||
      func.lazy.isReducing
    ) {
      // A run of one lazy function has nothing to fuse with, so an array is
      // passed to it directly, which runs its data-first implementation. Any
      // other iterable runs as a lazy sequence of one step, which has no
      // cross-step bookkeeping to set up: the step array, the step object,
      // and the hand-off through them are all overhead.
      output = Array.isArray(output)
        ? func(output)
        : processSingleLazyStep(
            // @ts-expect-error [ts2345] -- The overloads only pipe a value into a function that accepts it, and lazy functions only accept iterables.
            output,
            func.lazy,
            func.lazyArgs,
          );
      functionIndex += 1;
      continue;
    }

    // Fusing a run pays off only when one of its steps can stop the pipe
    // early, which skips the work of the remaining items. Without one, every
    // item goes through every step anyway, so an array goes through each
    // function's data-first implementation in turn instead, trading the
    // per-item step bookkeeping for an intermediate array per step. Other
    // iterables always fuse, as those implementations only accept arrays.
    const stepByStepEnd = Array.isArray(output)
      ? endOfStepByStepRun(functions, functionIndex)
      : functionIndex;
    if (stepByStepEnd > functionIndex) {
      do {
        // @ts-expect-error [ts2345] -- Every function before `stepByStepEnd` is lazy and gets the array the previous one returned, but TypeScript can't narrow the functions from the scan that found them.
        output = functions[functionIndex]!(output);
        functionIndex += 1;
      } while (functionIndex < stepByStepEnd);
      continue;
    }

    const lazySequence = buildLazySequence(functions, functionIndex);

    output = runLazySequence(output, lazySequence);
    functionIndex += lazySequence.length;

    // @ts-expect-error [ts2322] -- TypeScript can't follow the logic that `functionIndex - 1` is pointing to the last function in `lazySequence`.
    const lastLazyFunction: LazyUnaryFunction = functions[functionIndex - 1];
    if (lastLazyFunction.lazy.isReducing) {
      // @ts-expect-error [ts18046] -- output is always an array when the last lazy function in the sequence was reducing.
      output = output[0];
    }
  }

  return output;
}

/**
 * Plans the run of lazy functions that starts at `startIndex`, the same run
 * `buildLazySequence` would build: the consecutive lazy functions, ending after
 * the first reducing one.
 *
 * @returns The index after the run when none of its functions can stop the
 * pipe early, so they should run one after the other; `startIndex` when one of
 * them can, so the whole run should fuse.
 */
function endOfStepByStepRun(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
): number {
  for (let index = startIndex; index < functions.length; index++) {
    const func = functions[index]!;
    if (!("lazy" in func)) {
      return index;
    }

    const { lazy } = func;
    if (lazy.isStoppable) {
      return startIndex;
    }

    if (lazy.isReducing) {
      // Functions that reduce to a value always end the run.
      return index + 1;
    }
  }

  return functions.length;
}

function buildLazySequence(
  functions: readonly (UnaryFunction | LazyUnaryFunction)[],
  startIndex: number,
): readonly LazyStep[] {
  const lazySequence: LazyStep[] = [];

  for (let index = startIndex; index < functions.length; index++) {
    const func = functions[index]!;
    if (!("lazy" in func)) {
      break;
    }

    const lazyEvaluator = func.lazy(...func.lazyArgs);
    lazySequence.push(
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

  return lazySequence;
}

function runLazySequence(
  input: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  lazySequence: readonly LazyStep[],
): unknown[] {
  const accumulator: unknown[] = [];
  const slot = createLazySlot();

  if (Array.isArray(input)) {
    // Iterated rather than indexed, so a reactive array that instruments
    // iteration tracks one dependency instead of one per index.
    for (const item of input) {
      const isDone = processItem(lazySequence, accumulator, item, slot, 0);
      if (isDone) {
        break;
      }
    }

    // eslint-disable-next-line unicorn/no-duplicate-if-branches -- Intentional! Identical on purpose. In V8, a `for...of` that has only ever seen arrays skips the iterator protocol; each loop is its own iteration site, which is what lets the compiler specialize the first one for arrays, that sets, strings and generators never reach.
  } else {
    // @ts-expect-error [ts18046] -- The overloads only pipe a value into a function that accepts it, and lazy functions only accept iterables.
    for (const item of input) {
      const isDone = processItem(lazySequence, accumulator, item, slot, 0);
      if (isDone) {
        break;
      }
    }
  }

  return accumulator;
}

function processItem(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  lazySequence: readonly LazyStep[],
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
    stepIndex < lazySequence.length;
    stepIndex++
  ) {
    const step = lazySequence[stepIndex]!;

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
            processItem(lazySequence, accumulator, subItem, slot, stepIndex + 1)
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
