import { purry } from "./purry";
import type { LazyResult } from "./_reduceLazy";
import { _reduceLazy } from "./_reduceLazy";

/**
 * Returns a list of elements that exist in both array.
 * @param array - The source array.
 * @param other - The second array.
 * @signature
 *    R.intersection(array, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]) // => [2, 3]
 * @dataFirst
 * @category Array
 * @pipeable
 */
export function intersection<T>(
  source: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Returns a list of elements that exist in both array.
 * @param array - The source array.
 * @param other - The second array.
 * @signature
 *    R.intersection(other)(array)
 * @example
 *    R.intersection([2, 3, 5])([1, 2, 3]) // => [2, 3]
 * @dataLast
 * @category Array
 * @pipeable
 */
export function intersection<T, K>(
  other: ReadonlyArray<T>,
): (source: ReadonlyArray<K>) => Array<T>;

export function intersection() {
  return purry(_intersection, arguments, intersection.lazy);
}

function _intersection<T>(array: Array<T>, other: Array<T>) {
  const lazy = intersection.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace intersection {
  export function lazy<T>(other: Array<T>) {
    return (value: T): LazyResult<T> => {
      const set = new Set(other);
      if (set.has(value)) {
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
