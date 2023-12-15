import { purry } from './purry';

/**
 * Returns elements from the end of the array until the predicate returns false.
 *
 * @param array the array
 * @param fn the predicate
 * @signature
 *    R.takeLastWhile(array, fn)
 * @example
 *    R.takeLastWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function takeLastWhile<T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => boolean
): Array<T>;

/**
 * Returns elements from the end of the array until the predicate returns false.
 *
 * @param fn the predicate
 * @signature
 *    R.takeLastWhile(fn)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeLastWhile(x => x !== 4))  // => [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T>(
  fn: (item: T) => boolean
): (array: ReadonlyArray<T>) => Array<T>;

export function takeLastWhile() {
  return purry(_takeLastWhile, arguments);
}

function _takeLastWhile<T>(array: Array<T>, fn: (item: T) => boolean) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!fn(array[i])) {
      return array.slice(i + 1);
    }
  }
  return array;
}
