/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any --
 * This function is deprecated so it doesn't matter that it uses bad types.
 */
type DefinitelyObject<T> =
  Exclude<
    Extract<T, object>,
    Array<any> | Function | ReadonlyArray<any>
  > extends never
    ? Record<string, unknown>
    : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;

/**
 * A function that checks if the passed parameter is of type Object and narrows its type accordingly.
 *
 * ! **DEPRECATED**: Use: `R.isObjectType(data) && R.isNonNull(data) && !R.isArray(data)` or `R.isPlainObject(data)`. Will be removed in V2!
 *
 * @param data - The variable to check.
 * @returns True if the passed input is an Object, Promise, Date or Error, false otherwise.
 * @signature
 *    R.isObject(data)
 * @example
 *    R.isObject({}) //=> true
 *    R.isObject(Promise.resolve("something")) //=> true
 *    R.isObject(new Date()) //=> true
 *    R.isObject(new Error("error")) //=> true
 *    R.isObject('somethingElse') //=> false
 * @category Deprecated
 * @deprecated Use: `R.isObjectType(data) && R.isNonNull(data) && !R.isArray(data)` or `R.isPlainObject(data)`. Will be removed in V2!
 */
export function isObject<T>(data: T | object): data is DefinitelyObject<T> {
  return Boolean(data) && !Array.isArray(data) && typeof data === "object";
}
