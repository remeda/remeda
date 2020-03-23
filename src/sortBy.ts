import { purry } from './purry';

/**
 * Sorts the list according to the supplied function in ascending order.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 * @param array the array to sort
 * @param fn the mapping function
 * @signature
 *    R.sortBy(array, fn)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @data_first
 * @category Array
 */
export function sortBy<T>(array: readonly T[], fn: (item: T) => any): T[];

/**
 * Sorts the list according to the supplied function in ascending order.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 * @param fn the mapping function
 * @signature
 *    R.sortBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @data_last
 * @category Array
 */
export function sortBy<T>(fn: (item: T) => any): (array: readonly T[]) => T[];

export function sortBy() {
  return purry(_sortBy, arguments);
}

function _sortBy<T>(array: T[], fn: (item: T) => any): T[] {
  const copied = [...array];
  return copied.sort((a, b) => {
    const aa = fn(a);
    const bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
}
