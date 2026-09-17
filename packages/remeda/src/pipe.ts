/* eslint-disable jsdoc/check-param-names --
 * We document pipe's function params as a single parameter entry in the docs.
 */

import { processSingleLazyStep } from "./internal/processSingleLazyStep";
import type { LazyDefinition } from "./internal/types/LazyDefinition";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { isLazyControl, NO_DATA } from "./internal/utilityEvaluators";

type LazyStep = {
  readonly lazyEvaluator: LazyEvaluator;
  readonly isSingle: boolean;
  // Can't be derived from `items.length`: steps that don't read `data` share
  // one frozen empty array, so each step counts on its own.
  index: number;
} & (
  | {
      readonly requiresData: true;
      // Notice the array is mutable, we will be adding items as the pipe is
      // evaluating them. It is shared with every invocation of the evaluator.
      readonly items: unknown[];
    }
  | { readonly requiresData: false; readonly items: readonly never[] }
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
 * Any function can be used in pipes, not just Remeda utilities. The `purry`
 * utility adds currying support for custom functions; lazy evaluation is a
 * separate, internal protocol between Remeda's own utilities and `pipe`.
 *
 * A "headless" variant `piped` is available for creating reusable pipe
 * functions without initial data.
 *
 * IMPORTANT: During lazy evaluation, callbacks using the input array (the
 * third parameter for most functions, the fourth for `mapWithFeedback` and
 * `zipWith`) receive only items processed up to that point, not the complete
 * array. `pipe` only tracks those items for callbacks that declare the
 * parameter in which that function passes `data`, or whose `length` is 0
 * because their first parameter is a rest parameter. A callback that reaches
 * `data` through `arguments`, a default parameter, or a trailing rest
 * parameter (`(value, index, ...rest)`) receives an empty array instead.
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
 *    // index
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
    // We shouldn't waste effort on trivial pipes.
    return input;
  }

  if (functions.length === 1) {
    // A pipe of one lazy function is a lazy sequence of one step, which has no
    // cross-step bookkeeping to set up: the step array, the step object, and
    // the hand-off through them are all overhead. The check belongs here and
    // not inside the loop below, where the one-step case could also be spotted:
    // a loop body holding two processing calls measured ~7% slower on
    // multi-step pipes than one holding a single call, however the choice
    // between them was expressed, while deciding it before the loop leaves the
    // loop exactly as it was.
    const func = functions[0]!;
    if (!("lazy" in func) || !isIterable(input)) {
      return func(input);
    }

    const { lazy, lazyArgs } = func;
    const accumulator = processSingleLazyStep(input, lazy(...lazyArgs));
    return lazy.single === true ? accumulator[0] : accumulator;
  }

  let output = input;
  const lazySteps = functions.map((op) =>
    "lazy" in op ? buildLazyStep(op) : undefined,
  );

  let functionIndex = 0;
  while (functionIndex < functions.length) {
    const lazyStep = lazySteps[functionIndex];
    if (lazyStep === undefined || !isIterable(output)) {
      const func = functions[functionIndex]!;
      output = func(output);
      functionIndex += 1;
      continue;
    }

    const lazySequence = extractLazySequence(lazySteps, functionIndex);
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
  return lazyEvaluator.requiresData === true
    ? { lazyEvaluator, isSingle, index: 0, requiresData: true, items: [] }
    : {
        lazyEvaluator,
        isSingle,
        index: 0,
        requiresData: false,
        items: NO_DATA,
      };
}

function extractLazySequence(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Steps are mutated in place (the items buffer and the index counter) to avoid per-item allocations.
  lazySteps: readonly (LazyStep | undefined)[],
  startIndex: number,
): readonly LazyStep[] {
  const lazySequence: LazyStep[] = [];

  for (let index = startIndex; index < lazySteps.length; index++) {
    const lazyStep = lazySteps[index];
    if (lazyStep === undefined) {
      break;
    }

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

  for (const value of iterable) {
    const shouldExitEarly = processItem(value, accumulator, lazySequence, 0);
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
  startIndex: number,
): boolean {
  if (startIndex >= lazySequence.length) {
    // A `hasMany` fan-out from the last step has no further steps to run the
    // sub-items through, so they go straight to the accumulator.
    accumulator.push(item);
    return false;
  }

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
    const result = step.lazyEvaluator(currentItem, step.index, step.items);
    step.index += 1;

    if (!isLazyControl(result)) {
      // The common case: the evaluator emitted an item, hand it to the next
      // step as-is.
      currentItem = result;
      continue;
    }

    if (result.isDone) {
      isDone = true;
    }

    if (!result.hasValue) {
      // Skipped, or stopped without a value; nothing reaches the next step.
      return isDone;
    }

    if (result.hasMany) {
      const subItems = result.value;
      for (const subItem of subItems) {
        const shouldExitEarly = processItem(
          subItem,
          accumulator,
          lazySequence,
          stepIndex + 1,
        );
        if (shouldExitEarly) {
          return true;
        }
      }
      return isDone;
    }

    currentItem = result.value;
  }

  accumulator.push(currentItem);
  return isDone;
}

function isIterable(something: unknown): something is Iterable<unknown> {
  // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    typeof something === "string" ||
    (typeof something === "object" &&
      something !== null &&
      // eslint-disable-next-line unicorn/no-computed-property-existence-check -- The prototype-chain check is intentional: iterables inherit `Symbol.iterator` from their prototype (e.g. `Array.prototype`), and `Object.hasOwn` would reject them all.
      Symbol.iterator in something)
  );
}
