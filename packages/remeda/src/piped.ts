/* eslint-disable jsdoc/require-param -- We don't document the funcs */

import { pipe } from "./pipe";

/**
 * A data-last wrapper for `pipe`. See the documentation for that function for
 * more information.
 *
 * Use this utility for building callbacks for functions like `map` and `filter`
 * where the data type could be inferred from the call site.
 *
 * IMPORTANT: TypeScript doesn't support defining only some of a function's
 * type-params, making it hard to use `piped` as a general-purpose data-last
 * "headless" pipe (you'd have to define *all* the type params for it to work).
 * We don't recommend using `piped` for this, and instead define your own
 * function and use `pipe` internally instead; e.g.,
 *   `const foo = (data: Data) => pipe(data, ...functions);`
 *    and **not**: `const foo = piped<Data, ...>(functions);`.
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
export function piped<A, B>(func0: (input: A) => B): (data: A) => B;

export function piped<A, B, C>(
  func0: (input: A) => B,
  func1: (input: B) => C,
): (data: A) => C;

export function piped<A, B, C, D>(
  func0: (input: A) => B,
  func1: (input: B) => C,
  func2: (input: C) => D,
): (data: A) => D;

export function piped<A, B, C, D, E>(
  func0: (input: A) => B,
  func1: (input: B) => C,
  func2: (input: C) => D,
  func3: (input: D) => E,
): (data: A) => E;

export function piped<A, B, C, D, E, F>(
  func0: (input: A) => B,
  func1: (input: B) => C,
  func2: (input: C) => D,
  func3: (input: D) => E,
  func4: (input: E) => F,
): (data: A) => F;

export function piped<A, B, C, D, E, F, G>(
  func0: (input: A) => B,
  func1: (input: B) => C,
  func2: (input: C) => D,
  func3: (input: D) => E,
  func4: (input: E) => F,
  func5: (input: F) => G,
): (data: A) => G;

export function piped<A, B, C, D, E, F, G, H>(
  func0: (input: A) => B,
  func1: (input: B) => C,
  func2: (input: C) => D,
  func3: (input: D) => E,
  func4: (input: E) => F,
  func5: (input: F) => G,
  func6: (input: G) => H,
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
