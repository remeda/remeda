import { purry } from "./purry";

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * @param array - The array.
 * @param fn - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
export function indexBy<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>>;

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * @param fn - The indexing function.
 * @signature
 *    R.indexBy(fn)(array)
 * @example
 *    R.pipe(
 *      ['one', 'two', 'three'],
 *      R.indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @category Array
 */
export function indexBy<K extends PropertyKey, T>(
  fn: (item: T) => K,
): (array: ReadonlyArray<T>) => Partial<Record<K, T>>;

export function indexBy(): unknown {
  return purry(indexByImplementation, arguments);
}

function indexByImplementation<K extends PropertyKey, T>(
  array: ReadonlyArray<T>,
  fn: (item: T) => K,
): Partial<Record<K, T>> {
  const out: Partial<Record<K, T>> = {};

  for (const item of array) {
    const key = fn(item);
    out[key] = item;
  }

  return out;
}
