import { lazyEmptyEvaluator } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T>(array: ReadonlyArray<T>, n: number): Array<T>;

/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take<T>(n: number): (array: ReadonlyArray<T>) => Array<T>;

export function take(...args: ReadonlyArray<unknown>): unknown {
  return purry(takeImplementation, args, lazyImplementation);
}

const takeImplementation = <T>(array: ReadonlyArray<T>, n: number): Array<T> =>
  n < 0 ? [] : array.slice(0, n);

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyEmptyEvaluator;
  }

  let remaining = n;
  return (value) => {
    remaining -= 1;
    return { done: remaining <= 0, hasNext: true, next: value };
  };
}
