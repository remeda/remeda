/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isPromise(data)
 * @returns true if the passed input is a Promise, false otherwise
 * @example
 *    R.isPromise(Promise.resolve(5)) //=> true
 *    R.isPromise(Promise.reject(5)) //=> true
 *    R.isPromise('somethingElse') //=> false
 * @category Guard
 */

export function isPromise<T, S>(data: Promise<T> | S): data is Promise<T> {
  return data instanceof Promise;
}
