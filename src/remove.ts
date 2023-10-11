import { purry } from './purry';

/**
 * Removes the sub-array of `items` starting at index `start` and containing `count` elements.
 * @param items the array to remove.
 * @param start the index to start removing.
 * @param count the number of elements to remove.
 * @signature
 *    R.remove(items, start, count)
 * @example
 *    R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
 * @dataFirst
 * @category Array
 */
export function remove<T>(
  items: ReadonlyArray<T>,
  start: number,
  count: number
): Array<T>;

/**
 * Removes the sub-array of `items` starting at index `start` and containing `count` elements.
 * @param items the array to remove.
 * @param start the index to start removing.
 * @param count the number of elements to remove.
 * @signature
 *    R.remove(start, count)(items)
 * @example
 *    R.pipe([1,2,3,4,5,6,7,8], R.take(2, 3)) // => [1,2,6,7,8]
 * @dataLast
 * @category Array
 */
export function remove<T>(
  start: number,
  count: number
): (items: ReadonlyArray<T>) => Array<T>;

export function remove() {
  return purry(_remove, arguments);
}

function _remove(
  items: ReadonlyArray<any>,
  start: number,
  count: number
): Array<any> {
  const result = [...items];
  result.splice(start, count);
  return result;
}
