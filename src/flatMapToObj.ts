import type { PredIndexedOptional } from "./_types";
import { purry } from "./purry";

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 * @param array The array to map.
 * @param fn The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries
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
 * @category Array
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  array: ReadonlyArray<T>,
  fn: (element: T) => Array<[K, V]>,
): Record<K, V>;

/**
 * Map each element of an array into an object using a defined callback function and flatten the result.
 * @param fn The mapping function, which should return an Array of key-value pairs, similar to Object.fromEntries
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
 * @category Array
 */
export function flatMapToObj<T, K extends PropertyKey, V>(
  fn: (element: T) => Array<[K, V]>,
): (array: ReadonlyArray<T>) => Record<K, V>;

export function flatMapToObj() {
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
  ) =>
    array.reduce<Record<PropertyKey, unknown>>((result, element, index) => {
      const items = indexed ? fn(element, index, array) : fn(element);
      items.forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    }, {});

export namespace flatMapToObj {
  export function indexed<T, K extends PropertyKey, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>,
  ): Record<K, V>;
  export function indexed<T, K extends PropertyKey, V>(
    fn: (element: T, index: number, array: ReadonlyArray<T>) => Array<[K, V]>,
  ): (array: ReadonlyArray<T>) => Record<K, V>;
  export function indexed() {
    return purry(_flatMapToObj(true), arguments);
  }
}
