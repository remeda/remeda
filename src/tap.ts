import { purry } from './purry';

/**
 * Runs the given function with the supplied object, then returns the object.
 * @param value
 * @param fn the transducer
 * @signature
 *    R.tap(value, fn)
 * @example
 *    R.tap(1, x => console.log(`value is ${x}`)) // => 1, and logs "value is 1"
 * @data_first
 */
export function tap<T>(x: T, fn: (x: T) => void): T;

/**
 * Runs the given function with the supplied object, then returns the object.
 * @param fn the transducer
 * @signature
 *    R.tap(fn)(value)
 * @example
 *    R.pipe(1, R.tap(x => console.log(`value is ${x}`))) // => 1, and logs "value is 1"
 * @data_last
 */
export function tap<T>(fn: (x: T) => void): (x: T) => T;

export function tap() {
  return purry(_tap, arguments);
}

export function _tap<T>(x: T, fn: (x: T) => void): T {
  fn(x);
  return x;
}
