import { _isContainsMultiSetImplementation } from './_isContainsMultiSetImplementation';
import { purry } from './purry';

/**
 * Checks if a given array is contained within the data using multi-set
 * semantics. This means that for each item, we track how many copies of that
 * item are in the data and in the other array, and we match them up uniquely.
 *
 * This function uses a scalar object to define the identity for each item so
 * that we can match items that are not reference equal.
 *
 * @param data The array that would *contain* the elements.
 * @param other The array that would be *contained* in the elements.
 * @param scalarFunction A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.isContainsMultiSetBy(data, other, scalarFunction)
 * @example
 *   R.isContainsMultiSetBy([{id:1},{id:2}],[{id:1}],prop('id')); // => true
 *   R.isContainsMultiSetBy([{id:1},{id:2}],[],prop('id')); // => true
 *   R.isContainsMultiSetBy([{id:1},{id:2}],[{id:3}],prop('id')); // => false
 * @data_first
 * @category Array
 */
export function isContainsMultiSetBy<TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (value: TData | TOther) => unknown
): boolean;

/**
 * Checks if a given array is contained within the data using multi-set
 * semantics. This means that for each item, we track how many copies of that
 * item are in the data and in the other array, and we match them up uniquely.
 *
 * This function uses a scalar object to define the identity for each item so
 * that we can match items that are not reference equal.
 *
 * @param data The array that would *contain* the elements.
 * @param other The array that would be *contained* in the elements.
 * @param scalarFunction A function that extracts a value used as the item identity for comparisons.
 * @signature
 *   R.isContainsMultiSetBy(other, scalarFunction)(data)
 * @example
 *   R.pipe([{id:1},{id:2}], R.isContainsMultiSetBy([{id:1}],prop('id'))); // => true
 *   R.pipe([{id:1},{id:2}], R.isContainsMultiSetBy([],prop('id'))); // => true
 *   R.pipe([{id:1},{id:2}], R.isContainsMultiSetBy([{id:3}],prop('id'))); // => false
 * @data_last
 * @category Array
 */
export function isContainsMultiSetBy<TData, TOther>(
  other: ReadonlyArray<unknown>,
  scalarFunction: (value: TData | TOther) => unknown
): (data: ReadonlyArray<unknown>) => boolean;

export function isContainsMultiSetBy() {
  return purry(isContainsMultiSetByImplementation, arguments);
}

const isContainsMultiSetByImplementation = <TData, TOther>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>,
  scalarFunction: (value: TData | TOther) => unknown
): boolean => _isContainsMultiSetImplementation(data, other, scalarFunction);

// TODO: Ideally this logic could be implemented lazily so that if the other
// set is contained in our data we return earlier as soon as we match all it's
// items to items in the data. This means that if we have a large data set and
// a small set we are checking against we will have to scan the whole set before
// returning. This is the result of how we do lazy evaluation, where we don't
// have an "end" event we can return a different value for.
