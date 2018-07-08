import { purry } from './purry';

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.groupBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @data_first
 * @category Array
 */
export function indexBy<T>(array: T[], fn: (item: T) => any): Record<string, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given key.
 * @param array the array
 * @param fn the indexing function
 * @signature
 *    R.indexBy(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.groupBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @data_last
 * @category Array
 */
export function indexBy<T>(
  fn: (item: T) => any
): (array: T[]) => Record<string, T>;

export function indexBy() {
  return purry(_indexBy, arguments);
}

function _indexBy<T>(array: T[], fn: (item: T) => any) {
  return array.reduce(
    (ret, item) => {
      ret[fn(item).toString()] = item;
      return ret;
    },
    {} as Record<string, T>
  );
}
