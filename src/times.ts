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
  if (count < 0) {
    throw new RangeError("n must be a non-negative number");
  }

  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(fn(i));
  }

  return res;
}
