import { _isContainsMultiSetImplementation } from './_isContainsMultiSetImplementation';
import { purry } from './purry';

/**
 * Checks if a given array is contained within the data using multi-set
 * semantics. This means that for each item, we track how many copies of that
 * item are in the data and in the other array, and we match them up uniquely.
 *
 * @param data The array that would *contain* the elements.
 * @param other The array that would be *contained* in the elements.
 * @signature
 *   R.isContainsMultiSet(data, other)
 * @example
 *   R.isContainsMultiSet([1,2,3], [2])  // => true
 *   R.isContainsMultiSet([1,1,1], [1,1]) // => true
 *   R.isContainsMultiSet([1], [1,1])  // => false
 * @data_first
 * @category Array
 */
export function isContainsMultiSet<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>
): boolean;

/**
 * Checks if a given array is contained within the data using multi-set
 * semantics. This means that for each item, we track how many copies of that
 * item are in the data and in the other array, and we match them up uniquely.
 *
 * @param data The array that would *contain* the elements.
 * @param other The array that would be *contained* in the elements.
 * @signature
 *   R.isContainsMultiSet(other)(data)
 * @example
 *   R.pipe([1,2,3], R.isContainsMultiSet([2]))  // => true
 *   R.pipe([1,1,1], R.isContainsMultiSet([1,1])) // => true
 *   R.pipe([1], R.isContainsMultiSet([1,1]))  // => false
 * @data_last
 * @category Array
 */
export function isContainsMultiSet<T>(
  other: ReadonlyArray<T>
): (data: ReadonlyArray<T>) => boolean;

export function isContainsMultiSet() {
  return purry(isContainsMultiSetImplementation, arguments);
}

const isContainsMultiSetImplementation = (
  data: ReadonlyArray<unknown>,
  other: ReadonlyArray<unknown>
): boolean => _isContainsMultiSetImplementation(data, other);

// TODO: Ideally this logic could be implemented lazily so that if the other
// set is contained in our data we return earlier as soon as we match all it's
// items to items in the data. This means that if we have a large data set and
// a small set we are checking against we will have to scan the whole set before
// returning. This is the result of how we do lazy evaluation, where we don't
// have an "end" event we can return a different value for.
