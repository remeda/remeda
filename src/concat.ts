import { purry } from './purry';

/**
 * Combines two arrays.
 * @param arr1 the first array
 * @param arr2 the second array
 * @signature
 *    R.concat(arr1, arr2);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
export function concat<T, K>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<K>
): Array<T | K>;

/**
 * Combines two arrays.
 * @param arr2 the second array
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
export function concat<T, K>(
  arr2: ReadonlyArray<K>
): (arr1: ReadonlyArray<T>) => Array<T | K>;

export function concat() {
  return purry(_concat, arguments);
}

function _concat(arr1: ReadonlyArray<unknown>, arr2: ReadonlyArray<unknown>) {
  return arr1.concat(arr2);
}
