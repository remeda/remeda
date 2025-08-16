/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/check-param-names -- we don't document the op params, it'd be redundant */

import type { LazyDefinition } from "./internal/types/LazyDefinition";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { LazyResult } from "./internal/types/LazyResult";
import { SKIP_ITEM } from "./internal/utilityEvaluators";

type PreparedLazyFunction = LazyEvaluator & {
  readonly isSingle: boolean;

  // These are intentionally mutable, they maintain the lazy piped state.
  index: number;
  items: Array<unknown>;
};

type LazyFunction = LazyDefinition & ((input: unknown) => unknown);

/**
 * Performs left-to-right function composition, passing data through its
 * functions in sequence. Functions are invoked with the returned value of their
 * predecessors (similar to how the unix pipe operator works), and with the
 * first function being called with the input data, and the result of last
 * function is returned from pipe. In most cases functions are run serially,
 * one after the other, from top-to-bottom (or left-to-right).
 *
 * When two or more functions with a `lazy` tag in their documentation (e.g.,
 * `map`, `filter`, `take`, `drop`, `forEach`, etc...) are used *consecutively*
 * inside a pipe, their inputs are broken down and evaluated lazily item-
 * by-item, in an iterator-like chain, allowing partial evaluation via
 * optimistic early termination (only the items needed to compute the output
 * would be processed, and any additional items would be ignored). This is done
 * automatically and without any additional code or configuration. A pipe may
 * contain as many sequences of lazy functions of any length; with no
 * limitations. By designing the pipes to take advantage of this, expensive
 * computations are avoided and less intermediate data needs to be handled,
 * stored, and garbage collected.
 *
 * By taking advantage of Remeda's built-in currying, `pipe` enables you to
 * easily convert deeply nested, onion-like, transformations, or sequences
 * of transformation defining multiple temporary variables, into a readable
 * top-to-bottom data flow that matches how the transformation is executed.
 * (see example).
 *
 * Pipes can be built using any function, and not just Remeda utility
 * functions. For more advanced cases check out the `purry` utility which also
 * provides a way to provide a lazy variant for your function. (see example).
 *
 * A "headless" variant of `pipe` that doesn't take an initial data value and
 * instead returns a callback is available as `piped`. This version is useful
 * when creating pipes as callbacks to other functions; e.g., instead of doing
 * `foo(($) => pipe($, ...functions))` use `foo(piped(functions))`.
 *
 * Functions are only considered for lazy evaluation when their data-last form
 * is used directly within `pipe` (or `piped`). To disable lazy evaluation you
 * can call your function data-first via an arrow function, e.g., replace
 * `map(callback)` within a pipe with `($) => map($, callback)`.
 *
 * IMPORTANT: When functions are evaluated lazily, callbacks that use the third
 * parameter (the input array) receive only the items processed so far, not the
 * complete original array. (See example).
 *
 * @param data - The input data.
 * @param functions - A sequence of functions that take exactly one argument
 * and return a non-void value.
 * @signature
 *   R.pipe(data, ...functions);
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(3))); //=> [3, 6, 9]
 *
 *    // = Lazy evaluation =
 *    R.pipe(
 *      data,
 *      R.map(mapper),
 *      R.filter(predicate),
 *      // `mapper` and `predicate` would only run enough times to generate up
 *      // to three outputs.
 *      R.take(3),
 *    );
 *
 *    // = Custom logic within a pipe =
 *    R.pipe(
 *      data,
 *      R.map(mapper),
 *      ($) => foo(param0, $, param2),
 *      R.split(""),
 *      // etc...
 *    );
 *
 *    // = Migrating nested transformations to pipes =
 *    // The following computation can be migrated to the pipe below
 *    const result = first(
 *      filter(
 *        when(
 *          prop(
 *            groupBy(map(data, add(3)), ($) => ($ % 2 ? "odd" : "even")),
 *            "even",
 *          ),
 *          isNullish,
 *          constant([]),
 *        ),
 *        ($) => $ > 10,
 *      ),
 *    );
 *
 *    const result = pipe(
 *      data,
 *      map(add(3)),
 *      groupBy(($) => ($ % 2 ? "odd" : "even")),
 *      prop("even"),
 *      when(isNullish, constant([])),
 *      filter(($) => $ > 10),
 *      first(),
 *    );
 *
 *    // = Using the 3rd param of a callback =
 *    // The following would print out `data` in its entirety for each value
 *    // of `data`.
 *    forEach([1, 2, 3, 4], (_item, _index, data) => {
 *      console.log(data);
 *    }); //=> "[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]"
 *
 *    // But with `pipe` data would only contain the items up to the current
 *    // index
 *    pipe([1, 2, 3, 4], forEach((_item, _index, data) => {
 *      console.log(data);
 *    })); //=> "[1], [1, 2], [1, 2, 3], [1, 2, 3, 4]"
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
  ...functions: ReadonlyArray<LazyFunction | ((value: any) => unknown)>
): any {
  let output = input;

  const lazyFunctions = functions.map((op) =>
    "lazy" in op ? prepareLazyFunction(op) : undefined,
  );

  let functionIndex = 0;
  while (functionIndex < functions.length) {
    const lazyFunction = lazyFunctions[functionIndex];
    if (lazyFunction === undefined || !isIterable(output)) {
      const func = functions[functionIndex]!;
      output = func(output);
      functionIndex += 1;
      continue;
    }

    const lazySequence: Array<PreparedLazyFunction> = [];
    for (let index = functionIndex; index < functions.length; index++) {
      const lazyOp = lazyFunctions[index];
      if (lazyOp === undefined) {
        break;
      }

      lazySequence.push(lazyOp);
      if (lazyOp.isSingle) {
        break;
      }
    }

    const accumulator: Array<unknown> = [];

    for (const value of output) {
      const shouldExitEarly = processItem(value, accumulator, lazySequence);
      if (shouldExitEarly) {
        break;
      }
    }

    const { isSingle } = lazySequence.at(-1)!;
    output = isSingle ? accumulator[0] : accumulator;
    functionIndex += lazySequence.length;
  }
  return output;
}

function processItem(
  item: unknown,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, we use the accumulator directly to accumulate the results.
  accumulator: Array<unknown>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentionally mutable, the lazy sequence is stateful and contains the state needed to compute the next value lazily.
  lazySequence: ReadonlyArray<PreparedLazyFunction>,
): boolean {
  if (lazySequence.length === 0) {
    accumulator.push(item);
    return false;
  }

  let currentItem = item;

  let lazyResult: LazyResult<any> = SKIP_ITEM;
  let isDone = false;
  for (const [functionsIndex, lazyFn] of lazySequence.entries()) {
    const { index, items } = lazyFn;
    items.push(currentItem);
    lazyResult = lazyFn(currentItem, index, items);
    lazyFn.index += 1;
    if (lazyResult.hasNext) {
      if (lazyResult.hasMany ?? false) {
        for (const subItem of lazyResult.next as ReadonlyArray<unknown>) {
          const subResult = processItem(
            subItem,
            accumulator,
            lazySequence.slice(functionsIndex + 1),
          );
          if (subResult) {
            return true;
          }
        }
        return isDone;
      }
      currentItem = lazyResult.next;
    }
    if (!lazyResult.hasNext) {
      break;
    }
    // process remaining functions in the pipe
    // but don't process remaining elements in the input array
    if (lazyResult.done) {
      isDone = true;
    }
  }
  if (lazyResult.hasNext) {
    accumulator.push(currentItem);
  }
  return isDone;
}

function prepareLazyFunction(func: LazyFunction): PreparedLazyFunction {
  const { lazy, lazyArgs } = func;
  const fn = lazy(...lazyArgs);
  return Object.assign(fn, {
    isSingle: lazy.single ?? false,
    index: 0,
    items: [] as Array<unknown>,
  });
}

function isIterable(something: unknown): something is Iterable<unknown> {
  // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    typeof something === "string" ||
    (typeof something === "object" &&
      something !== null &&
      Symbol.iterator in something)
  );
}
