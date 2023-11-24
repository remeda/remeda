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

export namespace toPairs {
  export function strict<T extends Record<PropertyKey, unknown>>(
    object: T
  ): Array<NonNullable<{ [K in keyof T]: [K, T[K]] }[keyof T]>> {
    // @ts-expect-error [ts2322] - This is deliberately stricter than what TS
    // provides out of the box.
    return Object.entries(object);
  }
}
