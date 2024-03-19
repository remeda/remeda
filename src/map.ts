import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import type {
  IterableContainer,
  Mapped,
  PredIndexed,
  PredIndexedOptional,
} from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Map each element of an array using a defined callback function.
 *
 * @param data - The array to map.
 * @param mapper - The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.indexed(array, fn)
 * @example
 *    R.map([0, 0] as const, x => x + 1) // => [1, 1], typed [number, number]
 *    R.map.indexed([0, 0] as const, (x, i) => x + i) // => [0, 1], typed [number, number]
 * @dataFirst
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T extends IterableContainer, K>(
  data: T,
  mapper: (item: T[number]) => K,
): Mapped<T, K>;

/**
 * Map each value of an object using a defined callback function.
 *
 * @param mapper - The function mapper.
 * @signature
 *    R.map(fn)(array)
 *    R.map.indexed(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [0, 2, 4]
 *    R.pipe([0, 0, 0], R.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export function map<T extends IterableContainer, K>(
  mapper: (item: T[number]) => K,
): (items: T) => Mapped<T, K>;

export function map(): unknown {
  return purry(_map(false), arguments, map.lazy);
}

const _map =
  (indexed: boolean) =>
  <T, K>(array: ReadonlyArray<T>, fn: PredIndexedOptional<T, K>) =>
    _reduceLazy(array, indexed ? map.lazyIndexed(fn) : map.lazy(fn), indexed);

const _lazy =
  (indexed: boolean) =>
  <T, K>(fn: PredIndexedOptional<T, K>): LazyEvaluator<T, K> =>
  (value, index, array) => ({
    done: false,
    hasNext: true,
    next: indexed ? fn(value, index, array) : fn(value),
  });

export namespace map {
  export function indexed<T extends IterableContainer, K>(
    items: T,
    mapper: PredIndexed<T[number], K>,
  ): Mapped<T, K>;

  export function indexed<T extends IterableContainer, K>(
    mapper: PredIndexed<T[number], K>,
  ): (items: T) => Mapped<T, K>;

  export function indexed(): unknown {
    return purry(_map(true), arguments, map.lazyIndexed);
  }

  export const lazy = _lazy(false);
  export const lazyIndexed = _toLazyIndexed(_lazy(true));
}
