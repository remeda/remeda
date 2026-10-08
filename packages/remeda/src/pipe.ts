/* eslint-disable jsdoc/check-param-names --
 * We document pipe's function params as a single parameter entry in the docs.
 */

import {
  createLazySlot,
  LAST,
  MANY,
  SKIP_ITEM,
  STOP,
  type LazySlot,
} from "./internal/lazyControl";
import { processSingleLazyStep } from "./internal/processSingleLazyStep";
import type { LazyDefinition } from "./internal/types/LazyDefinition";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { UNEXPECTED_ACCESS_SENTINEL } from "./internal/unexpectedAccessSentinel";

type LazyStep = {
  readonly lazyEvaluator: LazyEvaluator;
  readonly isSingle: boolean;
  // Notice the index is mutable, it will be incremented as the pipe is evaluating items. It is shared with every invocation of the evaluator.
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

type LazyFunction = LazyDefinition & ((input: unknown) => unknown);

/**
 * Performs left-to-right function composition, passing data through functions
 * in sequence. Each function receives the output of the previous function,
 * creating a readable top-to-bottom data flow that matches how the
 * transformation is executed. This enables converting deeply nested function
 * calls into clear, sequential steps without temporary variables.
 *
 * When consecutive functions with a `lazy` tag (e.g., `map`, `filter`, `take`,
 * `drop`, `forEach`, etc...) are used together, they process data item-by-item
 * rather than creating intermediate arrays. This enables early termination
 * when only partial results are needed, improving performance for large
 * datasets and expensive operations.
 *
 * Functions are only evaluated lazily when their data-last form is used
 * directly in the pipe. To disable lazy evaluation, use data-first calls via
 * arrow functions: `($) => map($, callback)` instead of `map(callback)`.
 *
 * A "headless" variant `piped` is available for creating reusable pipe
 * functions without initial data.
 *
 * IMPORTANT: During lazy evaluation, callbacks using the third parameter (the
 * input array) receive only items processed up to that point, not the complete
 * array.
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
 *    // of `data`.
 *    forEach([1, 2, 3, 4], (_item, _index, data) => {
 *      console.log(data);
 *    }); //=> "[1, 2, 3, 4]" logged 4 times
 *
 *    // But with `pipe` data would only contain the items up to the current
 *    // index. A callback only receives `data` when it declares it as a
 *    // parameter.
 *    pipe([1, 2, 3, 4], forEach((_item, _index, data) => {
 *      console.log(data);
 *    })); //=> "[1]", "[1, 2]", "[1, 2, 3]", "[1, 2, 3, 4]"
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
  ...functions: readonly (LazyFunction | ((value: unknown) => unknown))[]
): unknown {
  if (functions.length === 0) {
    return input;
  }

  if (functions.length === 1) {
    // The most common pipe, a single function, skips the loop below.
    const func = functions[0]!;
    return "lazy" in func && isIterable(input)
      ? processSingleLazyStep(input, func.lazy, func.lazyArgs)
      : func(input);
  }

  let output = input;
  let functionIndex = 0;
  while (functionIndex < functions.length) {
    const func = functions[functionIndex]!;
    if (!("lazy" in func) || !isIterable(output)) {
      output = func(output);
      functionIndex += 1;
      continue;
    }

    const nextFunc = functions[functionIndex + 1];
    if (
      nextFunc === undefined ||
      !("lazy" in nextFunc) ||
      func.lazy.single === true
    ) {
      // A run of one lazy function is a lazy sequence of one step, which has
      // no cross-step bookkeeping to set up: the step array, the step object,
      // and the hand-off through them are all overhead.
      output = processSingleLazyStep(output, func.lazy, func.lazyArgs);
      functionIndex += 1;
      continue;
    }

    // Steps are built when the loop reaches their run with iterable data, so
    // a pipe without lazy functions, or whose lazy functions get non-iterable
    // data, builds none.
    const lazySequence = buildLazySequence(functions, functionIndex);
    const accumulator = processIterable(output, lazySequence);

    const { isSingle } = lazySequence.at(-1)!;
    output = isSingle ? accumulator[0] : accumulator;
    functionIndex += lazySequence.length;
  }

  return output;
}

function buildLazyStep({ lazy, lazyArgs }: LazyDefinition): LazyStep {
  const lazyEvaluator = lazy(...lazyArgs);
  const isSingle = lazy.single ?? false;
  return lazyEvaluator.requiresData
    ? {
        lazyEvaluator,
        isSingle,
        index: 0,
        requiresData: true,
        items: [],
      }
    : {
        lazyEvaluator,
        isSingle,
        index: 0,
        requiresData: false,
        items: UNEXPECTED_ACCESS_SENTINEL,
      };
}

function buildLazySequence(
  functions: readonly (LazyFunction | ((value: unknown) => unknown))[],
  startIndex: number,
): readonly LazyStep[] {
  const lazySequence: LazyStep[] = [];

  for (let index = startIndex; index < functions.length; index++) {
    const func = functions[index]!;
    if (!("lazy" in func)) {
      break;
    }

    const lazyStep = buildLazyStep(func);
    lazySequence.push(lazyStep);
    if (lazyStep.isSingle) {
      break;
    }
  }

  return lazySequence;
}

function processIterable(
  iterable: Iterable<unknown>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  lazySequence: readonly LazyStep[],
): unknown[] {
  const accumulator: unknown[] = [];
  const slot = createLazySlot();

  for (const value of iterable) {
    const shouldExitEarly = processItem(
      value,
      accumulator,
      lazySequence,
      slot,
      0 /* startIndex */,
    );
    if (shouldExitEarly) {
      break;
    }
  }

  return accumulator;
}

function processItem(
  item: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, we use the accumulator directly to accumulate the results.
  accumulator: unknown[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  lazySequence: readonly LazyStep[],
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
    const result = step.lazyEvaluator(
      currentItem,
      step.index,
      step.items,
      slot,
    );
    step.index += 1;

    // Every control is a symbol, so an item of any other type skips the
    // comparisons below with this one check.
    if (typeof result === "symbol") {
      if (result === SKIP_ITEM) {
        // Nothing reaches the next step.
        return isDone;
      }

      if (result === MANY) {
        // Read before the steps below run, as they leave their own payloads
        // in the same slot.
        const { values } = slot;
        for (const subItem of values) {
          const shouldExitEarly = processItem(
            subItem,
            accumulator,
            lazySequence,
            slot,
            stepIndex + 1,
          );
          if (shouldExitEarly) {
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
        // Stopped without a value; nothing reaches the next step.
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

function isIterable(something: unknown): something is Iterable<unknown> {
  // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    // Arrays are by far the most common input, and the compiler reduces this
    // check to a type test, where the `in` check below is a property lookup.
    Array.isArray(something) ||
    typeof something === "string" ||
    (typeof something === "object" &&
      something !== null &&
      // eslint-disable-next-line unicorn/no-computed-property-existence-check -- The prototype-chain check is intentional: iterables inherit `Symbol.iterator` from their prototype (e.g. `Array.prototype`), and `Object.hasOwn` would reject them all.
      Symbol.iterator in something)
  );
}
