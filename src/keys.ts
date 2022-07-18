/**
 * Returns a new array containing the keys of the array or object.
 * @param source Either an array or an object
 * @signature
 *    R.keys(source)
 * @example
 *    R.keys(['x', 'y', 'z']) // => ['1', '2', '3']
 *    R.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.keys,
 *      R.first
 *    ) // => 'a'
 * @pipeable
 * @category Object
 */

export function keys(
  source: Record<PropertyKey, unknown> | ArrayLike<unknown>
): Array<string> {
  return Object.keys(source);
}

export namespace keys {
  export function strict<T extends Record<PropertyKey, unknown>>(
    source: T
  ): Array<keyof T> {
    return keys(source) as any;
  }
}
