/* eslint-disable jsdoc/no-restricted-syntax, jsdoc/require-jsdoc, jsdoc/require-param -- ignore for deprecated files */

import { pipe } from "./pipe";

/**
 * Creates a data-last pipe function. First function must be always annotated. Other functions are automatically inferred.
 *
 * ! **DEPRECATED**: Use `R.piped(op1, op2, op3)`. Will be removed in V2!
 *
 * @signature
 *    R.createPipe(op1, op2, op3)(data);
 * @example
 *    R.createPipe(
 *      (x: number) => x * 2,
 *      x => x * 3
 *    )(1) // => 6
 * @category Deprecated
 * @deprecated Use `R.piped(op1, op2, op3)`. Will be removed in V2!
 */
export function createPipe<A, B>(op1: (input: A) => B): (value: A) => B;

export function createPipe<A, B, C>(
  op1: (input: A) => B,
  op2: (input: B) => C,
): (value: A) => C;

export function createPipe<A, B, C, D>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
): (value: A) => D;

export function createPipe<A, B, C, D, E>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
): (value: A) => E;

export function createPipe<A, B, C, D, E, F>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
): (value: A) => F;

export function createPipe<A, B, C, D, E, F, G>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
): (value: A) => G;

export function createPipe<A, B, C, D, E, F, G, H>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
): (value: A) => H;

export function createPipe(
  ...operations: ReadonlyArray<(input: unknown) => unknown>
) {
  return (value: unknown): unknown =>
    pipe(
      value,
      // @ts-expect-error [ts2556] - We can't avoid this error because pipe is typed for users and this is an internal function
      ...operations,
    );
}
