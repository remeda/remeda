import { purry } from './purry';

/**
 * Runs the given callback function with the supplied object, then returns the object.
 * @param value
 * @param fn callback function
 * @signature
 *    R.tap(value, fn)
 * @example
 *    R.tap(1, console.log) // => returns 1, and logs 1
 * @data_first
 */
export function tap<T>(x: T, fn: (x: T) => void): T;

/**
 * Runs the given function with the supplied object, then returns the object.
 * @param fn callback function
 * @signature
 *    R.tap(fn)(value)
 * @example
 *    R.pipe(1, R.tap(console.log)) // => returns 1, and logs 1
 * @data_last
 */
export function tap<T>(fn: (x: T) => void): (x: T) => T;

export function tap() {
  return purry(_tap, arguments);
}

export function _tap<T>(x: any, fn: (x: T) => void) {
  fn(x);
  return x;
}
