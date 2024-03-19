/* eslint-disable jsdoc/require-param-description -- We don't document the ops */

import { pipe } from "./pipe";

/**
 * A dataLast version of `pipe` that could be used to provide more complex
 * computations to functions that except a function as a param (like `map`,
 * `filter`, `groupBy`, etc...).
 *
 * The first function must be always annotated. Other functions are
 * automatically inferred.
 *
 * @param op1
 * @signature
 *    R.piped(op1, op2, op3)(data);
 * @example
 *    R.filter(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }],
 *      R.piped(
 *        R.prop('a'),
 *        (x) => x % 2 === 0,
 *      ),
 *    ); // => [{ a: 2 }]
 * @category Function
 */
export function piped<A, B>(op1: (input: A) => B): (value: A) => B;

export function piped<A, B, C>(
  op1: (input: A) => B,
  op2: (input: B) => C,
): (value: A) => C;

export function piped<A, B, C, D>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
): (value: A) => D;

export function piped<A, B, C, D, E>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
): (value: A) => E;

export function piped<A, B, C, D, E, F>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
): (value: A) => F;

export function piped<A, B, C, D, E, F, G>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
): (value: A) => G;

export function piped<A, B, C, D, E, F, G, H>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
): (value: A) => H;

export function piped(
  ...operations: ReadonlyArray<(input: unknown) => unknown>
) {
  return (value: unknown): unknown =>
    pipe(
      value,
      // @ts-expect-error [ts2556] - We can't avoid this error because pipe is typed for users and this is an internal function
      ...operations,
    );
}
