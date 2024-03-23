/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Promise, false otherwise.
 * @signature
 *    R.isPromise(data)
 * @example
 *    R.isPromise(Promise.resolve(5)) //=> true
 *    R.isPromise(Promise.reject(5)) //=> true
 *    R.isPromise('somethingElse') //=> false
 * @dataFirst
 * @category Guard
 */
export function isPromise<T, S>(data: Promise<T> | S): data is Promise<T> {
  return data instanceof Promise;
}
