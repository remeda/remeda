/* eslint-disable jsdoc/require-param -- We don't document the funcs */

import { pipe } from "./pipe";

/**
 * Data-last version of `pipe`. See `pipe` documentation for full details.
 *
 * Use `piped` when you need to pass a transformation as a callback to
 * functions like `map` and `filter`, where the data type can be inferred
 * from the call site.
 *
 * IMPORTANT: `piped` does not work as a "function factory" in order to create
 * standalone utility functions; because TypeScript cannot infer the input data
 * type (without requiring to explicitly define all type params for all
 * functions in the pipe). We recommend defining the function explicitly, and
 * then use `pipe` in its implementation.
 *
 * @signature
 *    R.piped(...functions)(data);
 * @example
 *    R.map(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }],
 *      R.piped(R.prop('a'), R.add(1)),
 *    ); //=> [2, 3, 4]
 * @dataLast
 * @category Function
 */
export function piped<A, B>(funcA: (input: A) => B): (data: A) => B;

export function piped<A, B, C>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
): (data: A) => C;

export function piped<A, B, C, D>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
): (data: A) => D;

export function piped<A, B, C, D, E>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
): (data: A) => E;

export function piped<A, B, C, D, E, F>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
): (data: A) => F;

export function piped<A, B, C, D, E, F, G>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
): (data: A) => G;

export function piped<A, B, C, D, E, F, G, H>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
): (data: A) => H;

export function piped(
  ...functions: ReadonlyArray<(input: unknown) => unknown>
) {
  return (value: unknown): unknown =>
    pipe(
      value,
      // @ts-expect-error [ts2556] - We can't avoid this error because pipe is typed for users and this is an internal function
      ...functions,
    );
}
