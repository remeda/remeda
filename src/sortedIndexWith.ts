import { purry } from './purry';

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * switches from returning `false` to returning `true`. This function assumes
 * that the array is "sorted" in regards to the predicate, meaning that running
 * the predicate as a mapper on it would result in an array `[...false[], ...true[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `array.length - 1` if the
 * predicate returns `false` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 *
 * @param data - Array, "sorted" by `predicate`
 * @param predicate - A predicate which also defines the array's order
 * @return - Index (In the range 0..array.length - 1)
 *
 * @signature
 *    R.sortedIndexWith(data, predicate)
 * @example
 *    R.sortedIndexWith(['a','ab','abc'], (item) => item.length > 2) // => 2
 * @data_first
 * @category Array
 *
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndexWith<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): number;

/**
 * Performs a **binary search** for the index of the item at which the predicate
 * switches from returning `false` to returning `true`. This function assumes
 * that the array is "sorted" in regards to the predicate, meaning that running
 * the predicate as a mapper on it would result in an array `[...false[], ...true[]]`.
 * This stricter requirement from the predicate provides us 2 benefits over
 * `findIndex` which does a similar thing:
 * 1. It would run at O(logN) time instead of O(N) time.
 * 2. It always returns a value (it would return `array.length - 1` if the
 * predicate returns `false` for all items).
 *
 * This function is the basis for all other sortedIndex functions which search
 * for a specific item in a sorted array, and it could be used to perform
 * similar efficient searches.
 *
 * @param data - Array, "sorted" by `predicate`
 * @param predicate - A predicate which also defines the array's order
 * @return - Index (In the range 0..array.length - 1)
 *
 * @signature
 *    R.sortedIndexWith(predicate)(data)
 * @example
 *    R.pipe(['a','ab','abc'], R.sortedIndexWith((item) => item.length > 2)) // => 2
 * @data_last
 * @category Array
 *
 * @see findIndex, sortedIndex, sortedIndexBy, sortedLastIndex, sortedLastIndexBy
 */
export function sortedIndexWith<T>(
  predicate: (item: T) => boolean
): (data: ReadonlyArray<T>) => number;

export function sortedIndexWith(): unknown {
  return purry(sortedIndexWithImplementation, arguments);
}

export function sortedIndexWithImplementation<T>(
  array: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): number {
  let lowIndex = 0;
  let highIndex = array.length;

  while (lowIndex < highIndex) {
    // We use bitwise operator here as a way to find the mid-point and round it
    // down using the same operation.
    const pivotIndex = (lowIndex + highIndex) >>> 1;
    const pivot = array[pivotIndex];

    if (predicate(pivot)) {
      lowIndex = pivotIndex + 1;
    } else {
      highIndex = pivotIndex;
    }
  }

  return highIndex;
}
