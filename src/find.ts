import { _toSingle } from "./_toSingle";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param predicate the predicate
 * @signature
 *    R.find(items, predicate)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    R.find([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function find<T, S extends T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => value is S,
): S | undefined;
export function find<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param predicate the predicate
 * @signature
 *    R.find(predicate)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find((n, i) => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @pipeable
 * @category Array
 */
export function find<T, S extends T>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => value is S,
): (array: ReadonlyArray<T>) => S | undefined;
export function find<T = never>(
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => T | undefined;

export function find(): unknown {
  return purry(findImplementation, arguments, _toSingle(lazyImplementation));
}

const findImplementation = <T>(
  array: ReadonlyArray<T>,
  predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
): T | undefined =>
  // eslint-disable-next-line unicorn/no-array-callback-reference -- predicate is built base on the signature for Array.prototype.find
  array.find(predicate);

const lazyImplementation =
  <T>(
    predicate: (value: T, index: number, obj: ReadonlyArray<T>) => boolean,
  ): LazyEvaluator<T> =>
  (value, index, array) =>
    predicate(value, index, array)
      ? { done: true, hasNext: true, next: value }
      : { done: false, hasNext: false };
