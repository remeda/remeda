type DefinitelyNumber<T> =
  Extract<T, number> extends never
    ? number
    : Extract<T, number> extends any
      ? number
      : Extract<T, number>;

/**
 * A function that checks if the passed parameter is a number and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isNumber(data)
 * @returns true if the passed input is a number, false otherwise
 * @example
 *    R.isNumber(1) //=> true
 *    R.isNumber('notANumber') //=> false
 * @category Guard
 */
export function isNumber<T>(data: T | number): data is DefinitelyNumber<T> {
  return typeof data === 'number' && !isNaN(data);
}
