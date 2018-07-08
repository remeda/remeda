import { purry } from './purry';

/**
 * Merges two objects. The same as `Object.assign`.
 * `b` object will override properties of `a`.
 * @param a the first object
 * @param b the second object
 * @signature
 *    R.merge(a, b)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @data_first
 * @category Object
 */
export function merge<A, B>(a: A, b: B): A & B;

/**
 * Merges two objects. The same as `Object.assign`. `b` object will override properties of `a`.
 * @param b the second object
 * @signature
 *    R.merge(b)(a)
 * @example
 *    R.merge({ y: 10, z: 2 })({ x: 1, y: 2 }) // => { x: 1, y: 10, z: 2 }
 * @data_last
 * @category Object
 */
export function merge<A, B>(b: B): (a: A) => A & B;

export function merge() {
  return purry(_merge, arguments);
}

function _merge<A, B>(a: A, b: B) {
  // tslint:disable-next-line:prefer-object-spread
  return Object.assign({}, a, b);
}
