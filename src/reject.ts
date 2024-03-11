import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to reject.
 * @param predicate the callback function.
 * @signature
 *    R.reject(array, predicate)
 *    R.reject(array, predicate)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function reject<T>(
  items: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to reject.
 * @param predicate the callback function.
 * @signature
 *    R.reject(array, predicate)
 *    R.reject(array, predicate)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 *    R.reject([1, 2, 3], (x, i, array) => x % 2 === 0) // => [1, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function reject<T>(
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): (items: ReadonlyArray<T>) => Array<T>;

export function reject(): unknown {
  return purry(rejectImplementation, arguments, lazyImplementation);
}

const rejectImplementation = <T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T> =>
  array.filter((item, index, data) => !predicate(item, index, data));

const lazyImplementation =
  <T>(
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): LazyEvaluator<T> =>
  (item, index, data) =>
    predicate(item, index, data)
      ? { done: false, hasNext: false }
      : { done: false, hasNext: true, next: item };
