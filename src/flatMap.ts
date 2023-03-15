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
  array: ReadonlyArray<T>,
  fn: (input: T) => K | Array<K>
): Array<K>;

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
  fn: (input: T) => K | Array<K>
): (array: ReadonlyArray<T>) => Array<K>;

export function flatMap() {
  return purry(_flatMap, arguments, flatMap.lazy);
}

function _map<T, K>(array: Array<T>, mapFn: (value: T) => K): Array<K> {
  const newArray = new Array<K>(array.length);
  for (let i = 0; i < array.length; i++) {
    newArray[i] = mapFn(array[i]);
  }
  return newArray;
}

function _flatMap<T, K>(array: Array<T>, fn: (input: T) => Array<K>): Array<K> {
  return flatten(_map(array, item => fn(item)));
}

export namespace flatMap {
  export function lazy<T, K>(fn: (input: T) => K | Array<K>) {
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
