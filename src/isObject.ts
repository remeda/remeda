type DefinitelyObject<T> = Exclude<
  Extract<T, object>,
  Array<any> | Function | ReadonlyArray<any>
> extends never
  ? Record<string, unknown>
  : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is of type Object and narrows its type accordingly
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
