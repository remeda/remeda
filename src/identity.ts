// TODO: Adding a native dataLast implementation using `purry` breaks the typing
// for `identity`. This is caused by the fact that `identity` is **so** generic
// that it can take in any type of data, including **functions**, making it
// impossible for typescript to infer the legacy "headless" calls properly,
// which will definitely break for too many users currently. When we release v2
// of Remeda we can do these sort of breaking changes.

/**
 * A function that always returns the param passed to it
 * @signature
 *    R.identity(data)
 * @example
 *    R.identity('foo') // => 'foo'
 * @category Function
 */
export function identity<T>(value: T): T {
  return value;
}
