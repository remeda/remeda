import { purry } from "./purry";

// TODO [>2]: Once we allow fromEntries to run lazily on iterables we need to remove this utility as it's completely replaceable by `fromEntries(map(...))`.
/**
 * Map each element of an array into an object using a defined mapper that
 * converts each item into an object entry (a tuple of `[<key>, <value>]`).
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * - `fromKeys` - Builds an object from an array of *keys* and a mapper for
 * values.
 * - `indexBy` - Builds an object from an array of *values* and a mapper for
 * keys.
 * - `pullObject` - Builds an object from an array of items with a mapper for
 * values and another mapper for keys.
 * - `fromEntries` - Builds an object from an array of key-value pairs.
 *
 * **Warning**: We strongly advise against using this function unless it is
 * used with a huge input array and your app has stringent memory/gc
 * constraints, or if the logic to compute the key and value are highly
 * dependent and expensive to compute. We recommend that in most cases you
 * should use: `pullObject`, or the composition `fromEntries(map(array, fn))`.
 * This function might be deprecated and **removed** in future versions of the
 * library!
 *
 * @param array - The array to map.
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(array, fn)
 * @example
 *    R.mapToObj([1, 2, 3], x => [String(x), x * 2]) // => {1: 2, 2: 4, 3: 6}
 * @dataFirst
 * @category Array
 */
export function mapToObj<T, K extends PropertyKey, V>(
  array: ReadonlyArray<T>,
  fn: (value: T, index: number, data: ReadonlyArray<T>) => [K, V],
): Record<K, V>;

// TODO [>2]: Once we allow fromEntries to run lazily on iterables we need to remove this utility as it's completely replaceable by `fromEntries(map(...))`.
/**
 * Map each element of an array into an object using a defined mapper that
 * converts each item into an object entry (a tuple of `[<key>, <value>]`).
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * - `fromKeys` - Builds an object from an array of *keys* and a mapper for
 * values.
 * - `indexBy` - Builds an object from an array of *values* and a mapper for
 * keys.
 * - `pullObject` - Builds an object from an array of items with a mapper for
 * values and another mapper for keys.
 * - `fromEntries` - Builds an object from an array of key-value pairs.
 *
 * **Warning**: We strongly advise against using this function unless it is
 * used with a huge input array and your app has stringent memory/gc
 * constraints, or if the logic to compute the key and value are highly
 * dependent and expensive to compute. We recommend that in most cases you
 * should use: `pullObject`, or the composition `fromEntries(map(array, fn))`.
 * This function might be deprecated and **removed** in future versions of the
 * library!
 *
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.mapToObj(x => [String(x), x * 2])
 *    ) // => {1: 2, 2: 4, 3: 6}
 * @dataLast
 * @category Array
 */
export function mapToObj<T, K extends PropertyKey, V>(
  fn: (value: T, index: number, data: ReadonlyArray<T>) => [K, V],
): (array: ReadonlyArray<T>) => Record<K, V>;

export function mapToObj(...args: ReadonlyArray<unknown>): unknown {
  return purry(mapToObjImplementation, args);
}

function mapToObjImplementation(
  array: ReadonlyArray<unknown>,
  fn: (
    value: unknown,
    index: number,
    data: ReadonlyArray<unknown>,
  ) => [PropertyKey, unknown],
): Record<PropertyKey, unknown> {
  const out: Record<PropertyKey, unknown> = {};

  for (const [index, element] of array.entries()) {
    const [key, value] = fn(element, index, array);
    out[key] = value;
  }

  return out;
}
