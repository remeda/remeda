import { purry } from './purry';
import { _reduceLazy } from './_reduceLazy';

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param array The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.filter(array, fn)
 *    R.filter.indexed(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 *    R.filter.indexed([1, 2, 3], (x, i) => x % 2 === 1) // => [1, 3]
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T>(array: T[], fn: (input: T) => boolean): T[];

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param fn the callback function.
 * @signature
 *    R.filter(fn)(array)
 *    R.filter.indexed(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 *    R.pipe([1, 2, 3], R.filter.indexed((x, i) => x % 2 === 1)) // => [1, 3]
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function filter<T>(fn: (input: T) => boolean): (array: T[]) => T[];

export function filter() {
  return purry(_filter(false), arguments, filter.lazy);
}

const _filter = (indexed: boolean) => <T>(
  array: T[],
  fn: (input: T, index?: number, array?: T[]) => boolean
) => {
  return _reduceLazy(
    array,
    indexed ? filter.lazyIndexed(fn) : filter.lazy(fn),
    indexed
  );
};

export namespace filter {
  export function indexed<T, K>(
    array: T[],
    fn: (input: T, idx: number, array: T[]) => boolean
  ): K[];
  export function indexed<T, K>(
    fn: (input: T, idx: number, array: T[]) => boolean
  ): (array: T[]) => K[];
  export function indexed() {
    return purry(_filter(true), arguments, filter.lazyIndexed);
  }

  export function lazy<T>(fn: (input: T) => boolean) {
    return (value: T) => {
      const valid = fn(value);
      return {
        done: false,
        hasNext: valid,
        next: value,
      };
    };
  }
  export function lazyIndexed<T>(
    fn: (input: T, index: number, array: T[]) => boolean
  ) {
    return (value: T, index: number, array: T[]) => {
      const valid = fn(value, index, array);
      return {
        done: false,
        hasNext: valid,
        next: value,
      };
    };
  }
  export namespace lazyIndexed {
    export const indexed = true;
  }
}
