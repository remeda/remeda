type DefinitelyString<T> =
  Extract<T, string> extends never
    ? string
    : Extract<T, string> extends any
      ? string
      : Extract<T, string>;

/**
 * A function that checks if the passed parameter is a string and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isString(data)
 * @returns true if the passed input is a string, false otherwise
 * @example
 *    R.isString('string') //=> true
 *    R.isString(1) //=> false
 * @category Guard
 */
export function isString<T>(data: T | string): data is DefinitelyString<T> {
  return typeof data === 'string';
}
