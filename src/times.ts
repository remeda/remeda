import type { GreaterThan } from "type-fest";
import { purry } from "./purry";

// This number was picked by trial-and-error until typescript stops failing with
// "Type instantiation is excessively deep and possibly infinite. (ts2589)".
// See the type tests for more information.
type MAX_LITERAL_SIZE = 46;

type TimesArray<
  T,
  N extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = number extends N
  ? // N is not a literal number, we can't deduce the type
    Array<T>
  : `${N}` extends `-${number}`
    ? // N is non-positive, the mapper will never run
      []
    : `${N}` extends `${infer K extends number}.${number}`
      ? // N is not an integer, we "floor" the number.
        TimesArray<T, K, Iteration>
      : GreaterThan<N, MAX_LITERAL_SIZE> extends true
        ? // We can't build a literal tuple beyond this size, after that we
          // can't add more items to the tuple so we add a rest element instead.
          [...TimesArray<T, MAX_LITERAL_SIZE, Iteration>, ...Array<T>]
        : N extends Iteration["length"]
          ? // We finished building the output tuple
            []
          : // Add another item to the tuple and recurse.
            [T, ...TimesArray<T, N, [unknown, ...Iteration]>];

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param count - A value between `0` and `n - 1`. Increments after each
 * function call.
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(count, fn)
 * @example
 *    R.times(5, R.identity()); //=> [0, 1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function times<T, N extends number>(
  count: N,
  fn: (index: number) => T,
): TimesArray<T, N>;

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(fn)(count)
 * @example
 *    R.times(R.identity())(5); //=> [0, 1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
export function times<T>(
  fn: (index: number) => T,
): <N extends number>(count: N) => TimesArray<T, N>;

export function times(...args: ReadonlyArray<unknown>): unknown {
  return purry(timesImplementation, args);
}

function timesImplementation<T>(
  count: number,
  fn: (index: number) => T,
): Array<T> {
  if (count < 1) {
    // We prefer to return trivial results on trivial inputs vs throwing errors.
    return [];
  }

  // Non-integer numbers would cause `new Array` to throw, but it makes more
  // sense to simply round them down to the nearest integer instead; but
  // rounding has some performance implications so we only do it when we have to
  const length = Number.isInteger(count) ? count : Math.floor(count);

  // eslint-disable-next-line unicorn/no-new-array -- This is the most efficient way to create the array, check out the benchmarks in the PR that added this comment.
  const res = new Array<T>(length);

  for (let i = 0; i < length; i++) {
    res[i] = fn(i);
  }

  return res;
}
