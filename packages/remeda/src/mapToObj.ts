import { purry } from "./purry";

/**
 * Map each element of an array into an object using a defined callback function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
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

/**
 * Map each element of an array into an object using a defined callback function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
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
