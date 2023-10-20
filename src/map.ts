import { purry } from './purry';
import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';
import {
  IterableContainer,
  Pred,
  PredIndexed,
  PredIndexedOptional,
} from './_types';

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
 * @dataFirst
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
 * @dataLast
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

// Redefining the map API with a stricter return type. This API is accessed via
// `map.strict`
interface Strict {
  <T extends IterableContainer, K>(
    items: T,
    mapper: Pred<T[number], K>
  ): StrictOut<T, K>;

  <T extends IterableContainer, K>(
    mapper: Pred<T[number], K>
  ): (items: T) => StrictOut<T, K>;

  readonly indexed: {
    <T extends IterableContainer, K>(
      items: T,
      mapper: PredIndexed<T[number], K>
    ): StrictOut<T, K>;

    <T extends IterableContainer, K>(
      mapper: PredIndexed<T[number], K>
    ): (items: T) => StrictOut<T, K>;
  };
}

type StrictOut<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
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

  export const strict: Strict = map;
}
