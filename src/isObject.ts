/* eslint @typescript-eslint/ban-types: ["error",{types:{Function: false},extendDefaults:true}] --
 * Function is used generically in this file to define any type of function, so
 * this lint error is not relevant for it.
 */
type DefinitelyObject<T> = Exclude<
  Extract<T, object>,
  Array<any> | Function | ReadonlyArray<any>
> extends never
  ? Record<string, unknown>
  : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;

/**
 * A function that checks if the passed parameter is of type Object and narrows its type accordingly
 *
 * @deprecated this guard is confusing because it rejects arrays but doesn't reject classes or built-in objects. Instead, use `isObjectType` for a broader check for anything "object", or `isPlainObject` for simple struct/shape/record-like objects. You can also achieve the same logic with `(x) => isObjectType(x) && !isArray(x)`.
 *
 * @param data the variable to check
 * @signature
 *    R.isObject(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    R.isObject({}) //=> true
 *    R.isObject(Promise.resolve("something")) //=> true
 *    R.isObject(new Date()) //=> true
 *    R.isObject(new Error("error")) //=> true
 *    R.isObject('somethingElse') //=> false
 * @category Guard
 */
export function isObject<T>(data: T | object): data is DefinitelyObject<T> {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}
