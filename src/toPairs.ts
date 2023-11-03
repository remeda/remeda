import { ObjectKeys } from './_types';

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *    R.toPairs(object)
 *    R.toPairs.strict(object)
 * @example
 *    R.toPairs({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.toPairs.strict({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 * @strict
 * @category Object
 */
export function toPairs<T>(object: Record<string, T>): Array<[string, T]> {
  return Object.entries(object);
}

// Inspired and largely copied from `sindresorhus/ts-extras`:
// @see https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-entries.ts
type ObjectValues<T extends Record<PropertyKey, unknown>> =
  Required<T>[ObjectKeys<T>];
type ObjectEntry<T extends Record<PropertyKey, unknown>> = [
  ObjectKeys<T>,
  ObjectValues<T>,
];
type ObjectEntries<T extends Record<PropertyKey, unknown>> = Array<
  ObjectEntry<T>
>;

export namespace toPairs {
  export function strict<T extends Record<PropertyKey, unknown>>(
    object: T
  ): ObjectEntries<T> {
    // @ts-expect-error [ts2322] - This is deliberately stricter than what TS
    // provides out of the box.
    return Object.entries(object);
  }
}
