import { splitAt } from './splitAt';
import { purry } from './purry';

/**
 * Splits a given array at the first index where the given predicate returns true.
 * @param array the array to split
 * @param fn the predicate
 * @signature
 *    R.splitWhen(array, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @data_first
 * @category Array
 */
export function splitWhen<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean
): [Array<T>, Array<T>];

/**
 * Splits a given array at an index where the given predicate returns true.
 * @param fn the predicate
 * @signature
 *    R.splitWhen(fn)(array)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @data_last
 * @category Array
 */
export function splitWhen<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];

export function splitWhen() {
  return purry(_splitWhen, arguments);
}

function _splitWhen<T>(array: Array<T>, fn: (item: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (
      fn(
        // @ts-expect-error [ts2345] - We are iterating over the array so we know
        // this is safe.
        array[i]
      )
    ) {
      return splitAt(array, i);
    }
  }
  return [array, []];
}
