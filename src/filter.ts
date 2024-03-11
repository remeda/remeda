import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param array The array to filter.
 * @param predicate the callback function.
 * @signature
 *    R.filter(array, predicate)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 *    R.filter([1, 2, 3], (x, i, array) => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => value is S,
): Array<S>;
export function filter<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param predicate the callback function.
 * @signature
 *    R.filter(predicate)(array)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 *    R.pipe([1, 2, 3], R.filter((x, i) => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function filter<T, S extends T>(
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => value is S,
): (array: ReadonlyArray<T>) => Array<S>;
export function filter<T>(
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => Array<T>;

export function filter(): unknown {
  return purry(filterImplementation, arguments, lazyImplementation);
}

const filterImplementation = <T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
): Array<T> =>
  // eslint-disable-next-line unicorn/no-array-callback-reference -- predicate is built base on the signature for Array.prototype.filter
  array.filter(predicate);

const lazyImplementation =
  <T>(
    predicate: (value: T, index: number, array: ReadonlyArray<T>) => boolean,
  ): LazyEvaluator<T> =>
  (value, index, array) =>
    predicate(value, index, array)
      ? { done: false, hasNext: true, next: value }
      : { done: false, hasNext: false };
