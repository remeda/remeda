import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';

/**
 * Excludes the values from `other` array.
 * @param array the source array
 * @param other the values to exclude
 * @signature
 *    R.difference(array, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]) // => [1, 4]
 * @data_first
 * @category Array
 * @pipeable
 */
export function difference<T>(array: readonly T[], other: readonly T[]): T[];

/**
 * Excludes the values from `other` array.
 * @param other the values to exclude
 * @signature
 *    R.difference(other)(array)
 * @example
 *    R.difference([2, 5, 3])([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 3, 4, 5, 6], // only 4 iterations
 *      R.difference([2, 3]),
 *      R.take(2)
 *    ) // => [1, 4]
 * @data_last
 * @category Array
 * @pipeable
 */
export function difference<T, K>(
  other: readonly T[]
): (array: readonly K[]) => T[];

export function difference() {
  return purry(_difference, arguments, difference.lazy);
}

function _difference<T>(array: T[], other: T[]) {
  const lazy = difference.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace difference {
  export function lazy<T>(other: T[]) {
    const set = new Set(other);
    return (value: T): LazyResult<T> => {
      if (!set.has(value)) {
        return {
          done: false,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  }
}
