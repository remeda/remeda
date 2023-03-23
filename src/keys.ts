/**
 * Returns a new array containing the keys of the array or object.
 * @param source Either an array or an object
 * @signature
 *    R.keys(source)
 *    R.keys.strict(source)
 * @example
 *    R.keys(['x', 'y', 'z']) // => ['0', '1', '2']
 *    R.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.keys,
 *      R.first
 *    ) // => 'a'
 *    R.keys.strict({ a: 'x', b: 'y', 5: 'z' } as const ) // => ['a', 'b', '5'], typed Array<'a' | 'b' | '5'>
 * @pipeable
 * @strict
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
  ): Array<
    { [K in keyof T]-?: K extends string | number ? `${K}` : never }[keyof T]
  > {
    return keys(source) as any;
  }
}
