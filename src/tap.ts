import { purry } from './purry';

/**
 * Calls the given function with the given value, then returns the given value.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param value the value to pass into the function
 * @param fn the function to call
 * @signature
 *    R.tap(value, fn)
 * @example
 *    R.tap("foo", console.log) // => "foo"
 * @dataFirst
 * @category Other
 */
export function tap<T>(value: T, fn: (value: T) => void): T;

/**
 * Calls the given function with the given value, then returns the given value.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param fn the function to call
 * @signature
 *    R.tap(fn)(value)
 * @example
 *    const log = <T>(value: T) => console.log(value);
 *    R.pipe(
 *      [-1, 2],
 *      R.filter(n => n > 0),
 *      R.tap(log), // prints [2]
 *      R.map(n => n * 2)
 *    ) // => [4]
 * @dataLast
 * @category Other
 */
export function tap<T>(fn: (value: T) => void): (value: T) => T;

export function tap() {
  return purry(_tap, arguments);
}

function _tap<T>(value: T, fn: (value: T) => void): T {
  fn(value);
  return value;
}
