/**
 * A function that always returns the param passed to it
 * @signature
 *    R.identity(data)
 * @example
 *    R.identity('foo') // => 'foo'
 * @category Function
 */
export function identity<T>(value: T) {
  return value;
}
