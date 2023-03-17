import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import { Pred, PredIndexedOptional, PredIndexed } from './_types';

// Used by the strict variant
type Mapped<T extends ReadonlyArray<unknown> | [], K> = {
  -readonly [P in keyof T]: K;
};

/**
 * Map each element of an array using a defined callback function. If the input
 * array is a tuple use the `strict` variant to maintain it's shape.
 * @param array The array to map.
 * @param fn The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.indexed(array, fn)
 *    R.map.strict(array, fn)
 *    R.map.strict.indexed(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 2) // => [2, 4, 6], typed number[]
 *    R.map.indexed([0, 0, 0], (x, i) => i) // => [0, 1, 2], typed number[]
 *    R.map.strict([0, 0] as const, x => x + 1) // => [1, 1], typed [number, number]
 *    R.map.strict.indexed([0, 0] as const, (x, i) => x + i) // => [0, 1], typed [number, number]
 * @data_first
 * @indexed
 * @pipeable
 * @strict
 * @category Array
 */
export function map<T, K>(array: ReadonlyArray<T>, fn: Pred<T, K>): Array<K>;

/**
 * Map each value of an object using a defined callback function.
 * @param fn the function mapper
 * @signature
 *    R.map(fn)(array)
 *    R.map.indexed(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [0, 2, 4]
 *    R.pipe([0, 0, 0], R.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @data_last
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T, K>(
  fn: Pred<T, K>
): (array: ReadonlyArray<T>) => Array<K>;

export function map() {
  return purry(_map(false), arguments, map.lazy);
}

const _map =
  (indexed: boolean) =>
  <T, K>(array: Array<T>, fn: PredIndexedOptional<T, K>) => {
    return _reduceLazy(
      array,
      indexed ? map.lazyIndexed(fn) : map.lazy(fn),
      indexed
    );
  };

const _lazy =
  (indexed: boolean) =>
  <T, K>(fn: PredIndexedOptional<T, K>) => {
    return (value: T, index?: number, array?: Array<T>): LazyResult<K> => {
      return {
        done: false,
        hasNext: true,
        next: indexed ? fn(value, index, array) : fn(value),
      };
    };
  };

export namespace map {
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, K>
  ): Array<K>;
  export function indexed<T, K>(
    fn: PredIndexed<T, K>
  ): (array: ReadonlyArray<T>) => Array<K>;
  export function indexed() {
    return purry(_map(true), arguments, map.lazyIndexed);
  }

  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));

  export function strict<T extends ReadonlyArray<unknown> | [], K>(
    array: Readonly<T>,
    fn: Pred<T[number], K>
  ): Mapped<T, K>;
  export function strict<T extends ReadonlyArray<unknown> | [], K>(
    fn: Pred<T[number], K>
  ): (array: Readonly<T>) => Mapped<T, K>;
  export function strict(...args: ReadonlyArray<unknown>): unknown {
    // @ts-expect-error [ts2556] - Strict is just an alias for map, we only care
    // about the typing here, but it's not easy to tell typescript that that's
    // all we are doing.
    return map(...args);
  }

  export namespace strict {
    export function indexed<T extends ReadonlyArray<unknown> | [], K>(
      array: Readonly<T>,
      fn: PredIndexed<T[number], K>
    ): Mapped<T, K>;
    export function indexed<T extends ReadonlyArray<unknown> | [], K>(
      fn: PredIndexed<T[number], K>
    ): (array: Readonly<T>) => Mapped<T, K>;
    export function indexed(...args: ReadonlyArray<unknown>): unknown {
      // @ts-expect-error [ts2556] - Strict is just an alias for map, we only
      // care about the typing here, but it's not easy to tell typescript that
      // that's all we are doing.
      return map.indexed(...args);
    }
  }
}
