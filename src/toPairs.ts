/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object
 * @signature
 *    R.toPairs(object)
 * @example
 *    R.toPairs({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 * @category Object
 */
export function toPairs<T>(object: { [s: string]: T }): Array<[string, T]> {
  return Object.entries(object);
}
