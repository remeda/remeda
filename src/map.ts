import { purry } from './purry';

/**
 * Map each element of an array using a defined callback function.
 * Indexed version is supported.
 * @param array The array to map.
 * @param fn The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.indexed(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 2) // => [2, 4, 6]
 *    R.map.indexed([0, 0, 0], (x, i) => i) // => [0, 1, 2]
 * @data_first
 * @category Array
 */
export function map<T, K>(array: T[], fn: (input: T) => K): K[];

/**
 * Map each value of an object using a defined callback function.
 * Indexed version is supported.
 * @param fn the function mapper
 * @signature
 *    R.map(fn)(array)
 *    R.map.indexed(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [2, 4, 6]
 *    R.pipe([0, 0, 0], R.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @data_last
 * @category Array
 */
export function map<T, K>(fn: (input: T) => K): (array: T[]) => K[];

export function map() {
  return purry(_map(false), arguments);
}

map.indexed = function mapIndexed() {
  return purry(_map(true), arguments);
};

const _map = (indexed: boolean) => <T, K>(
  array: T[],
  fn: (input: T, index?: number, array?: T[]) => K
) => {
  return array.map(
    (item, i, array) => (indexed ? fn(item, i, array) : fn(item))
  );
};

interface MapIndexed {
  <T, K>(array: T[], fn: (input: T, idx: number, array: T[]) => K): K[];
  <T, K>(fn: (input: T, idx: number, array: T[]) => K): (array: T[]) => K[];
}

export namespace map {
  export var indexed: MapIndexed;
}
