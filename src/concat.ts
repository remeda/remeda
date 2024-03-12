import { purry } from "./purry";

/**
 * Combines two arrays.
 *
 * @param arr1 - The first array.
 * @param arr2 - The second array.
 * @signature
 *    R.concat(arr1, arr2);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
export function concat<T, K>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<K>,
): Array<K | T>;

/**
 * Combines two arrays.
 *
 * @param arr2 - The second array.
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
export function concat<T, K>(
  arr2: ReadonlyArray<K>,
): (arr1: ReadonlyArray<T>) => Array<K | T>;

export function concat(): unknown {
  return purry(_concat, arguments);
}

function _concat<T, K>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<K>,
): Array<K | T> {
  return (arr1 as Array<K | T>).concat(arr2);
}
