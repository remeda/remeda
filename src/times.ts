import { purry } from "./purry";

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param count - A value between `0` and `n - 1`. Increments after each function call.
 * @param fn - The function to invoke. Passed one argument, the current value of `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(count, fn)
 * @example
 *    R.times(5, R.identity()); //=> [0, 1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function times<T>(count: number, fn: (n: number) => T): Array<T>;

/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param fn - The function to invoke. Passed one argument, the current value of `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(fn)(count)
 * @example
 *    R.times(R.identity())(5); //=> [0, 1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
export function times<T>(fn: (n: number) => T): (count: number) => Array<T>;

export function times(...args: ReadonlyArray<unknown>): unknown {
  return purry(timesImplementation, args);
}

function timesImplementation<T>(count: number, fn: (n: number) => T): Array<T> {
  if (count < 1) {
    // We prefer to return trivial results on trivial inputs vs throwing errors.
    return [];
  }

  // eslint-disable-next-line unicorn/no-new-array -- This is the most efficient way to create the array, check out the benchmarks in the PR that added this comment.
  const res = new Array<T>(
    // Non-integer numbers would cause `new Array` to throw, but it makes more
    // sense to simply round them down to the nearest integer instead; but
    // rounding has some performance implications so we only do it when we have
    // to.
    Number.isInteger(count) ? count : Math.floor(count),
  );

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}
