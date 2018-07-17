import { purry } from './purry';

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param items the array
 * @param fn the predicate
 * @signature
 *    R.find(items, fn)
 *    R.find.indexed(items, fn)
 * @example
 *    R.find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 *    R.find.indexed([1, 3, 4, 6], (n, i) => n % 2 === 0) // => 4
 * @data_first
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T>(array: T[], fn: (value: T) => boolean): T | undefined;

/**
 * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
 * @param fn the predicate
 * @signature
 *    R.find(fn)(items)
 *    R.find.indexed(fn)(items)
 * @example
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find(n => n % 2 === 0)
 *    ) // => 4
 *    R.pipe(
 *      [1, 3, 4, 6],
 *      R.find.indexed((n, i) => n % 2 === 0)
 *    ) // => 4
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function find<T = never>(
  fn: (value: T) => boolean
): (array: T[]) => T | undefined;

export function find() {
  return purry(_find(false), arguments, find.lazy);
}

const _find = (indexed: boolean) => <T>(
  array: T[],
  fn: (input: T, index?: number, array?: T[]) => any
) => {
  if (indexed) {
    return array.find(fn);
  }

  return array.find(x => fn(x));
};

export namespace find {
  export function indexed<T>(
    array: T[],
    fn: (input: T, idx: number, array: T[]) => boolean
  ): T | undefined;
  export function indexed<T>(
    fn: (input: T, idx: number, array: T[]) => boolean
  ): (array: T[]) => T | undefined;
  export function indexed() {
    return purry(_find(true), arguments, find.lazyIndexed);
  }

  export function lazy<T, K>(fn: (input: T) => boolean) {
    return (value: T) => {
      if (fn(value)) {
        return {
          done: true,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  }
  export namespace lazy {
    export const single = true;
  }
  export function lazyIndexed<T>(
    fn: (input: T, index?: number, array?: T[]) => any
  ) {
    return (value: T, index: number, array: T[]) => {
      if (fn(value, index, array)) {
        return {
          done: true,
          hasNext: true,
          next: value,
        };
      }
      return {
        done: false,
        hasNext: false,
      };
    };
  }
  export namespace lazyIndexed {
    export const indexed = true;
    export const single = true;
  }
}
