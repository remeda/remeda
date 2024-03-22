/* eslint-disable jsdoc/require-param, jsdoc/require-example, jsdoc/require-description -- Deprecated file */

import type { PredIndexedOptional } from "./_types";
import { purry } from "./purry";

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 *
 * ! **DEPRECATED**: Use `R.fromEntries.strict(R.flatMap(array, fn))`. Will be removed in V2!
 *
 * @param array - The array to map.
 * @param fn - The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.flatMapToObj(array, fn)
 *    R.flatMapToObj.indexed(array, fn)
 * @example
 *  R.flatMapToObj([1, 2, 3], (x) =>
 *    x % 2 === 1 ? [[String(x), x]] : []
 *  ) // => {1: 1, 3: 3}
 *  R.flatMapToObj.indexed(['a', 'b'], (x, i) => [
 *    [x, i],
 *    [x + x, i + i],
 *  ]) // => {a: 0, aa: 0, b: 1, bb: 2}
 * @dataFirst
 * @indexed
 * @category Deprecated
 * @deprecated Use `R.fromEntries.strict(R.flatMap(array, fn))`. Will be removed in V2!
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  array: ReadonlyArray<T>,
  fn: (element: T) => Array<[K, V]>,
): Record<K, V>;

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 *
 * ! **DEPRECATED**: Use `(array: ReadonlyArray<T>) => R.fromEntries.strict(R.flatMap(array, fn))` or if used in a pipe: `pipe(..., R.flatMap(fn), R.fromEntries.strict(), ...)`. Will be removed in V2!
 *
 * @param fn - The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.flatMapToObj(fn)(array)
 *    R.flatMapToObj(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.flatMapToObj(x => (x % 2 === 1 ? [[String(x), x]] : []))
 *    ) // => {1: 1, 3: 3}
 *    R.pipe(
 *      ['a', 'b'],
 *      R.flatMapToObj.indexed((x, i) => [
 *        [x, i],
 *        [x + x, i + i],
 *      ])
 *    ) // => {a: 0, aa: 0, b: 1, bb: 2}
 * @dataLast
 * @indexed
 * @category Deprecated
 * @deprecated Use `(array: ReadonlyArray<T>) => R.fromEntries.strict(R.flatMap(array, fn))` or if used in a pipe: `pipe(..., R.flatMap(fn), R.fromEntries.strict(), ...)`. Will be removed in V2!
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  fn: (element: T) => Array<[K, V]>,
): (array: ReadonlyArray<T>) => Record<K, V>;

export function flatMapToObj(): unknown {
  return purry(_flatMapToObj(false), arguments);
}

const _flatMapToObj =
  (indexed: boolean) =>
  <T>(
    array: ReadonlyArray<T>,
    fn: PredIndexedOptional<
      T,
      ReadonlyArray<readonly [key: PropertyKey, value: unknown]>
    >,
  ) => {
    const out: Record<PropertyKey, unknown> = {};
    for (let index = 0; index < array.length; index++) {
      // TODO: Once we bump the TypeScript target above ES5 we can use Array.prototype.entries to iterate over both the index and the value at the same time.
      const element = array[index]!;
      const items = indexed ? fn(element, index, array) : fn(element);

      for (const [key, value] of items) {
        out[key] = value;
      }
    }
    return out;
  };

export namespace flatMapToObj {
  /**
   * @deprecated Use `R.fromEntries.strict(R.flatten(R.map.indexed(array, fn)))`. Will be removed in V2!
   */
  export function indexed<T, K extends PropertyKey, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>,
  ): Record<K, V>;

  /**
   * @deprecated Use `(array: ReadonlyArray<T>) => R.fromEntries.strict(R.flatten(R.map.indexed(array, fn)))` or if used in a pipe: `pipe(..., R.map.indexed(fn), R.flatten(), R.fromEntries.strict(), ...)`. Will be removed in V2!
   */
  export function indexed<T, K extends PropertyKey, V>(
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>,
  ): (array: ReadonlyArray<T>) => Record<K, V>;
  export function indexed(): unknown {
    return purry(_flatMapToObj(true), arguments);
  }
}
