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
 * Perform left-to-right function composition, effectively passing data through
 * functions in sequence. Each transforming function must accept exactly one
 * parameter, and return a non-void value.
 *
 * By taking advantage of Remeda's built-in currying, `pipe` enables you to
 * easily convert deeply nested, onion-like, transformations into a readable
 * top-to-bottom data flow that matches how you think about the transformation.
 *
 * When two or more consecutive functions are marked with `@lazy` (e.g., `map`,
 * `filter`, `take`, `drop`, `forEach`, etc...) they are evaluated lazily in an
 * iterator-like chain, allowing partial evaluation via optimistic early
 * termination. By designing the pipes to take advantage of this, expensive
 * computations could be skipped entirely if not needed.
 *
 * A "headless" variant of `pipe` that doesn't take an initial data value and
 * instead returns a callback that accepts the data is available as `piped`.
 * This version is useful when creating pipes as callbacks to other functions.
 *
 * Functions are only considered for lazy evaluation when their data-last form
 * is used directly within `pipe` (or `piped`). To disable lazy evaluation you
 * can call your function data-first via an arrow function, e.g., replace
 * `map(callback)` within a pipe with `($) => map($, callback)`.
 *
 * IMPORTANT: When functions are evaluated lazily, callbacks that use the third
 * parameter (the input array) receive only the items processed so far, not the
 * complete original array.
 *
 * @param data - The input data.
 * @param functions - A sequence of functions that take one argument and return
 * a value. Each function needs to be able to handle the output of the previous
 * function.
 * @signature
 *   R.pipe(data, ...functions);
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(3))); //=> [3, 6, 9]
 *
 *    // = Custom logic within a pipe =
 *    R.pipe(
 *      data,
 *      R.map(...),
 *      ($) => foo(param0, $, param2, ...),
 *      R.split(...),
 *      // etc...
 *    );
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

export function pipe<A, B>(data: A, op1: (input: A) => B): B;

export function pipe<A, B, C>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
): C;

export function pipe<A, B, C, D>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
): D;

export function pipe<A, B, C, D, E>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
): E;

export function pipe<A, B, C, D, E, F>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  data: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
  op9: (input: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
): K;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
): L;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
): M;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
): N;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
): O;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  data: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
  op15: (input: O) => P,
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
