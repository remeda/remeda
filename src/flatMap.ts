import { flatten } from "./flatten";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param array - The array to map.
 * @param fn - The function mapper.
 * @signature
 *    R.flatMap(array, fn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @pipeable
 * @category Array
 * @mapping lodash flatMap
 * @mapping ramda chain
 */
export function flatMap<T, K>(
  array: ReadonlyArray<T>,
  fn: (input: T) => K | ReadonlyArray<K>,
): Array<K>;

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param fn - The function mapper.
 * @signature
 *    R.flatMap(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @pipeable
 * @category Array
 * @mapping lodash flatMap
 * @mapping ramda chain
 */
export function flatMap<T, K>(
  fn: (input: T) => K | ReadonlyArray<K>,
): (array: ReadonlyArray<T>) => Array<K>;

export function flatMap(): unknown {
  return purry(_flatMap, arguments, flatMap.lazy);
}

function _flatMap<T, K>(
  array: ReadonlyArray<T>,
  fn: (input: T) => ReadonlyArray<K>,
): Array<K> {
  return flatten(array.map((item) => fn(item)));
}

export namespace flatMap {
  export const lazy =
    <T, K>(fn: (input: T) => K | ReadonlyArray<K>): LazyEvaluator<T, K> =>
    // @ts-expect-error [ts2322] - We need to make LazyMany better so it accommodate the typing here...
    (value) => {
      const next = fn(value);
      return Array.isArray(next)
        ? { done: false, hasNext: true, hasMany: true, next }
        : { done: false, hasNext: true, next };
    };
}
