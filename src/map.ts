import { _reduceLazy } from "./_reduceLazy";
import type { IterableContainer, PredIndexed } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Map each element of an array using a defined callback function. If the input
 * array is a tuple use the `strict` variant to maintain it's shape.
 * @param array The array to map.
 * @param mapper The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.strict(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 2) // => [2, 4, 6], typed number[]
 *    R.map([0, 0, 0], (x, i) => i) // => [0, 1, 2], typed number[]
 *    R.map.strict([0, 0] as const, x => x + 1) // => [1, 1], typed [number, number]
 *    R.map.strict([0, 0] as const, (x, i) => x + i) // => [0, 1], typed [number, number]
 * @dataFirst
 * @pipeable
 * @strict
 * @category Array
 */
export function map<T, K>(
  array: ReadonlyArray<T>,
  mapper: (value: T, index: number, array: ReadonlyArray<T>) => K,
): Array<K>;

/**
 * Map each value of an object using a defined callback function.
 * @param mapper the function mapper
 * @signature
 *    R.map(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [0, 2, 4]
 *    R.pipe([0, 0, 0], R.map((x, i) => i)) // => [0, 1, 2]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function map<T, K>(
  mapper: (value: T, index: number, array: ReadonlyArray<T>) => K,
): (array: ReadonlyArray<T>) => Array<K>;

export function map(): unknown {
  return purry(mapImplementation, arguments, _lazy);
}

const mapImplementation = <T, K>(
  array: ReadonlyArray<T>,
  mapper: (value: T, index: number, array: ReadonlyArray<T>) => K,
): Array<K> => _reduceLazy(array, _lazy(mapper));

const _lazy =
  <T, K>(
    mapper: (value: T, index: number, array: ReadonlyArray<T>) => K,
  ): LazyEvaluator<T, K> =>
  (value, index, array) => ({
    done: false,
    hasNext: true,
    next: mapper(value, index, array),
  });

// Redefining the map API with a stricter return type. This API is accessed via
// `map.strict`
type Strict = {
  <T extends IterableContainer, K>(
    items: T,
    mapper: (value: T[number], index: number, array: T) => K,
  ): StrictOut<T, K>;

  <T extends IterableContainer, K>(
    mapper: (value: T[number], index: number, array: T) => K,
  ): (items: T) => StrictOut<T, K>;

  readonly indexed: {
    /**
     * @deprecated use `map.strict` directly, `indexed` modifier no longer needed.
     */
    <T extends IterableContainer, K>(
      items: T,
      mapper: PredIndexed<T[number], K>,
    ): StrictOut<T, K>;

    /**
     * @deprecated use `map.strict` directly, `indexed` modifier no longer needed.
     */
    <T extends IterableContainer, K>(
      mapper: PredIndexed<T[number], K>,
    ): (items: T) => StrictOut<T, K>;
  };
};

type StrictOut<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};

export namespace map {
  /**
   * @deprecated use `map` directly, `indexed` modifier no longer needed.
   */
  export function indexed<T, K>(
    array: ReadonlyArray<T>,
    fn: PredIndexed<T, K>,
  ): Array<K>;

  /**
   * @deprecated use `map` directly, `indexed` modifier no longer needed.
   */
  export function indexed<T, K>(
    fn: PredIndexed<T, K>,
  ): (array: ReadonlyArray<T>) => Array<K>;

  export function indexed(): unknown {
    return purry(mapImplementation, arguments, _lazy);
  }

  export const strict: Strict = map;
}
