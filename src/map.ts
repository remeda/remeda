import type { IterableContainer } from "./_types";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Map each element of an array using a defined callback function. If the input
 * array is a tuple use the `strict` variant to maintain it's shape.
 * @param array The array to map.
 * @param callbackfn The mapping function.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, callbackfn)
 *    R.map.strict(array, callbackfn)
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
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => K,
): Array<K>;

/**
 * Map each value of an object using a defined callback function.
 * @param callbackfn The mapping function
 * @signature
 *    R.map(callbackfn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [0, 2, 4]
 *    R.pipe([0, 0, 0], R.map((x, i) => i)) // => [0, 1, 2]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function map<T, K>(
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => K,
): (array: ReadonlyArray<T>) => Array<K>;

export function map(): unknown {
  return purry(mapImplementation, arguments, lazyImplementation);
}

const mapImplementation = <T, K>(
  array: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => K,
): Array<K> =>
  // eslint-disable-next-line unicorn/no-array-callback-reference -- callbackfn is built base on the signature for Array.prototype.map
  array.map(callbackfn);

const lazyImplementation =
  <T, K>(
    callbackfn: (value: T, index: number, array: ReadonlyArray<T>) => K,
  ): LazyEvaluator<T, K> =>
  (value, index, array) => ({
    done: false,
    hasNext: true,
    next: callbackfn(value, index, array),
  });

// Redefining the map API with a stricter return type. This API is accessed via
// `map.strict`
type Strict = {
  <T extends IterableContainer, K>(
    items: T,
    callbackfn: (value: T[number], index: number, array: T) => K,
  ): StrictOut<T, K>;

  <T extends IterableContainer, K>(
    callbackfn: (value: T[number], index: number, array: T) => K,
  ): (items: T) => StrictOut<T, K>;
};

type StrictOut<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};

export namespace map {
  export const strict: Strict = map;
}
