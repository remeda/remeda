type DefinitelyBoolean<T> =
  Extract<T, boolean> extends never
    ? boolean
    : Extract<T, boolean> extends any
      ? boolean
      : Extract<T, number>;

/**
 * A function that checks if the passed parameter is a boolean and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isBoolean(data)
 * @returns true if the passed input is a boolean, false otherwise
 * @example
 *    R.isBoolean(true) //=> true
 *    R.isBoolean(false) //=> true
 *    R.isBoolean('somethingElse') //=> false
 * @category Guard
 */

export function isBoolean<T>(data: T | boolean): data is DefinitelyBoolean<T> {
  return typeof data === 'boolean';
}
