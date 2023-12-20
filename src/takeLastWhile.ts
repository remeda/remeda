import { purry } from './purry';

/**
 * Returns elements from the end of the array until the predicate returns false.
 *
 * @param data the array
 * @param predicate the predicate
 * @signature
 *    R.takeLastWhile(data, predicate)
 * @example
 *    R.takeLastWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function takeLastWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T) => boolean
): Array<T>;

/**
 * Returns elements from the end of the array until the predicate returns false.
 *
 * @param predicate the predicate
 * @signature
 *    R.takeLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeLastWhile(x => x !== 4))  // => [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function takeLastWhile<T>(
  predicate: (item: T) => boolean
): (data: ReadonlyArray<T>) => Array<T>;

export function takeLastWhile() {
  return purry(_takeLastWhile, arguments);
}

function _takeLastWhile<T>(data: Array<T>, predicate: (item: T) => boolean) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (!predicate(data[i])) {
      return data.slice(i + 1);
    }
  }
  return data;
}
