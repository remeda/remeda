import { purry } from './purry';
import { _reduceLazy } from './_reduceLazy';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param array The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.filter(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @data_first
 * @category Array
 */
export function filter<T>(array: T[], fn: (input: T) => boolean): T[];

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param fn the callback function.
 * @signature
 *    R.filter(fn)(array)
 * @example
 *    R.filter(x => x % 2 === 1)([1, 2, 3]) // => [1, 3]
 * @data_last
 * @category Array
 */
export function filter<T>(fn: (input: T) => boolean): (array: T[]) => T[];

export function filter() {
  return purry(_filter, arguments, filter.lazy);
}

function _filter<T>(array: T[], fn: (input: T) => boolean) {
  const lazy = filter.lazy(fn);
  return _reduceLazy(array, lazy);
}

export namespace filter {
  export function lazy<T, K>(
    fn: (input: T, index?: number, array?: T[]) => boolean
  ) {
    return (value: T, index: number, array: T[]) => {
      const valid = index == null ? fn(value) : fn(value, index, array);
      return {
        done: false,
        hasNext: valid,
        next: value,
      };
    };
  }
}
