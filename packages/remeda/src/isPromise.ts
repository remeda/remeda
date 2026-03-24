import type { NarrowedTo } from "./internal/types/NarrowedTo";

/**
 * A function that checks if the passed parameter is a Promise and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Promise, false otherwise.
 * @signature
 *    isPromise(data)
 * @example
 *    isPromise(Promise.resolve(5)) //=> true
 *    isPromise(Promise.reject(5)) //=> true
 *    isPromise('somethingElse') //=> false
 * @category Guard
 */
export function isPromise<T>(
  data: Readonly<PromiseLike<unknown>> | T,
): data is NarrowedTo<T, PromiseLike<unknown>> {
  return data instanceof Promise;
}
