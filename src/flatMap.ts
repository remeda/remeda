import { flatten } from './flatten';
import { purry } from './purry';

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    R.flatMap(array, fn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @data_first
 * @pipeable
 * @category Array
 */
export function flatMap<T, K>(
  array: readonly T[],
  fn: (input: T) => K | K[]
): K[];

/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 * @param array The array to map.
 * @param fn The function mapper.
 * @signature
 *    R.flatMap(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @data_last
 * @pipeable
 * @category Array
 */
export function flatMap<T, K>(
  fn: (input: T) => K | K[]
): (array: readonly T[]) => K[];

export function flatMap() {
  return purry(_flatMap, arguments, flatMap.lazy);
}

function _flatMap<T, K>(array: T[], fn: (input: T) => K[]): K[] {
  return flatten(array.map(item => fn(item)));
}

export namespace flatMap {
  export function lazy<T, K>(fn: (input: T) => K | K[]) {
    return (value: T) => {
      const next = fn(value);
      if (Array.isArray(next)) {
        return {
          done: false,
          hasNext: true,
          hasMany: true,
          next: next,
        };
      }
      return {
        done: false,
        hasNext: true,
        next,
      };
    };
  }
}
