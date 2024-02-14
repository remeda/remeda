/* eslint @typescript-eslint/ban-types: ["error",{types:{Function: false},extendDefaults:true}] --
 * Function is used generically in this file to define any type of function, so
 * this lint error is not relevant for it.
 */
type DefinitelyObject<T> =
  Exclude<
    Extract<T, object>,
    Array<any> | Function | ReadonlyArray<any>
  > extends never
    ? Record<string, unknown>
    : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;

/**
 * A function that checks if the passed parameter is of type Object and narrows its type accordingly
 *
 * ! **DEPRECATED: The semantics of this guard are confusing. It excludes Arrays but does not exclude other complex objects like Classes or built-in objects (such as Date, Promise, Error, etc.). Instead, consider using {@link isObjectType} for a more inclusive validation encompassing any JavaScript "object" type, or {@link isPlainObject} for a more specific validation targeting simple struct/shape/record-like objects. To replicate the existing logic, use: `const isObject = (x) => isObjectType(x) && !Array.isArray(x)`.** !
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
 * @deprecated - The semantics of this guard are confusing. It excludes Arrays but does not exclude other complex objects like Classes or built-in objects (such as Date, Promise, Error, etc.). Instead, consider using `isObjectType` for a more inclusive validation encompassing any JavaScript "object" type, or `isPlainObject` for a more specific validation targeting simple struct/shape/record-like objects. To replicate the existing logic, use: `const isObject = (x) => isObjectType(x) && !Array.isArray(x)`.
 */
export function isObject<T>(data: T | object): data is DefinitelyObject<T> {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}
