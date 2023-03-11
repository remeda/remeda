import { purry } from './purry';

/**
 * Returns elements from the array until predicate returns false.
 * @param array the array
 * @param fn the predicate
 * @signature
 *    R.takeWhile(array, fn)
 * @example
 *    R.takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @data_first
 * @category Array
 */
export function takeWhile<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean
): Array<T>;

/**
 * Returns elements from the array until predicate returns false.
 * @param fn the predicate
 * @signature
 *    R.takeWhile(fn)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @data_last
 * @category Array
 */
export function takeWhile<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => Array<T>;

export function takeWhile() {
  return purry(_takeWhile, arguments);
}

function _takeWhile<T>(array: Array<T>, fn: (item: T) => boolean) {
  const ret: Array<T> = [];
  for (const item of array) {
    if (!fn(item)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
