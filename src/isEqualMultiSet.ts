import { _isEqualMultiSetImplementation } from './_isEqualMultiSetImplementation';
import { purry } from './purry';

/**
 * Compare two arrays for item equality, disregarding order, using *multi-set*
 * (or "bag") semantics. Arrays are equal if they have the same number of copies
 * of each item.
 *
 * Items are compared shallowly using `Object.is`, see `isEqualMultiSetBy` for
 * more control over the comparison, or `equals` for a general purpose comparer.
 *
 * @param data - The base array.
 * @param other - The array to compare against.
 * @signature
 *   R.isEqualMultiSet(data, other)
 * @example
 *   R.isEqualMultiSet([1, 2, 3], [2, 3, 1]) // => true
 *   R.isEqualMultiSet([1, 1, 1], [1, 1]) // => false
 *   R.isEqualMultiSet([1, 2, 3], [1, 1, 3]) // => false
 * @data_first
 * @category Array
 */
export function isEqualMultiSet<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): boolean;

/**
 * Compare two arrays for item equality, disregarding order, using *multi-set*
 * (or "bag") semantics. Arrays are equal if they have the same number of copies
 * of each item.
 *
 * Items are compared shallowly using `Object.is`, see `isEqualMultiSetBy` for
 * more control over the comparison, or `equals` for a general purpose comparer.
 *
 * @param data - The base array.
 * @param other - The array to compare against.
 * @signature
 *   R.isEqualMultiSet(other)(data)
 * @example
 *   R.pipe([1,2,3], R.isEqualMultiSet([2, 3, 1])) // => true
 *   R.pipe([1,1,1], R.isEqualMultiSet([1, 1])) // => false
 *   R.pipe([1,2,3], R.isEqualMultiSet([1, 1, 3])) // => false
 * @data_last
 * @category Array
 */
export function isEqualMultiSet<T>(
  other: ReadonlyArray<T>
): (data: ReadonlyArray<T>) => boolean;

export function isEqualMultiSet() {
  return purry(isEqualMultiSetImplementation, arguments);
}

const isEqualMultiSetImplementation = <T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): boolean => _isEqualMultiSetImplementation(data, other);
