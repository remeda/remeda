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
 * Creates a new array populated with the results of calling `mapper` on every
 * element in the calling array.
 *
 * @param data - The array to map.
 * @param mapper - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(array, mapper)
 *    R.map.indexed(array, mapper)
 * @example
 *    R.map([1, 2, 3], R.multiply(2)); // => [2, 4, 6]
 *    R.map([0, 0], R.add(1)); // => [1, 1]
 *    R.map.indexed([0, 0, 0], (_, i) => i); // => [0, 1, 2]
 *    R.map.indexed([0, 0], (x, i) => x + i); // => [0, 1]
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
 * Creates a new array populated with the results of calling `mapper` on every
 * element in the calling array.
 *
 * @param mapper - A function to execute for each element in the array. Its
 * return value is added as a single element in the new array.
 * @returns A new array with each element being the result of the callback
 * function.
 * @signature
 *    R.map(mapper)(array)
 *    R.map.indexed(mapper)(array)
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(2))); // => [2, 4, 6]
 *    R.pipe([0, 0], R.map(R.add(1))); // => [1, 1]
 *    R.pipe([0, 0, 0], R.map.indexed((_, i) => i)); // => [0, 1, 2]
 *    R.pipe([0, 0], R.map.indexed((x, i) => x + i)); // => [0, 1]
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
  <T, K>(array: ReadonlyArray<T>, mapper: PredIndexedOptional<T, K>) =>
    _reduceLazy(
      array,
      indexed ? map.lazyIndexed(mapper) : map.lazy(mapper),
      indexed,
    );

const _lazy =
  (indexed: boolean) =>
  <T, K>(mapper: PredIndexedOptional<T, K>): LazyEvaluator<T, K> =>
  (value, index, array) => ({
    done: false,
    hasNext: true,
    next: indexed ? mapper(value, index, array) : mapper(value),
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
