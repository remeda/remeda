import { purry } from './purry';
import { zip } from './zip';

/**
 * Creates a new object from a list of keys and a list of values.
 * If the list of keys is longer than the list of values, the unmatches
 * keys will have a value of `undefined`. If the list of values is longer than
 * the list of keys, an error will be throw (TODO: is that the desired
 * behavior?)
 * @param keys the list of keys
 * @param values the list of values
 * @signature
 *   R.zipObj(keys, values)
 * @example
 *   R.zip(['a', 'b'],[1,2]) // => { a: 1, b: 2 }
 * @data_first
 * @category Object
 */
export function zipObj<K extends any, V extends any>(
  keys: ReadonlyArray<K>,
  values: ReadonlyArray<V>
): Record<K, V>;

/**
 * Creates a new object from a list of keys and a list of values.
 * If the list of keys is longer than the list of values, the unmatches
 * keys will have a value of `undefined`. If the list of values is longer than
 * the list of keys, an error will be throw (TODO: does it make sense to have a
 * data last version of this function?)
 * @param values the list of values
 * @signature
 *   R.zip(values)(keys)
 * @example
 *   R.zip([1, 2])(['a', 'b']) // => { a: 1, b: 2 }
 * @data_last
 * @category Object
 */
export function zipObj<V extends any>(
  values: ReadonlyArray<V>
): <K extends any>(keys: ReadonlyArray<K>) => Record<K, V>;

export function zipObj() {
  return purry(_zipObj, arguments);
}

function _zipObj(keys: Array<unknown>, values: Array<unknown>) {
  const keysLength = keys.length;
  const valuesLength = values.length;

  if (valuesLength > keysLength)
    throw new Error(
      `Number of values exceeds number of keys (${keysLength} keys, ${valuesLength} values)`
    );

  if (valuesLength < keysLength) {
    values = values.concat(Array(keys.length - values.length).fill(undefined));
  }

  return Object.fromEntries(zip(keys, values));
}
