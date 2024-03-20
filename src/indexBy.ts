import type { ExactRecord } from "./_types";
import { purry } from "./purry";

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * @param data - The array.
 * @param mapper - The indexing function.
 * @signature
 *    R.indexBy(array, fn)
 * @example
 *    R.indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
export function indexBy<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  mapper: (item: T) => K,
): ExactRecord<K, T>;

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * @param mapper - The indexing function.
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
export function indexBy<T, K extends PropertyKey>(
  mapper: (item: T) => K,
): (data: ReadonlyArray<T>) => ExactRecord<K, T>;

export function indexBy(): unknown {
  return purry(indexByImplementation, arguments);
}

function indexByImplementation<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  mapper: (item: T) => K,
): ExactRecord<K, T> {
  const out: Partial<Record<K, T>> = {};

  for (const item of data) {
    const key = mapper(item);
    out[key] = item;
  }

  return out as ExactRecord<K, T>;
}
