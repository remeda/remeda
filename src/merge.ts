import { purry } from "./purry";

/**
 * Merges two objects. The same as `Object.assign`.
 * `b` object will override properties of `a`.
 *
 * @param a - The first object.
 * @param b - The second object.
 * @signature
 *    R.merge(a, b)
 * @example
 *    R.merge({ x: 1, y: 2 }, { y: 10, z: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataFirst
 * @category Object
 */
export function merge<A, B>(a: A, b: B): A & B;

/**
 * Merges two objects. The same as `Object.assign`. `b` object will override properties of `a`.
 *
 * @param b - The second object.
 * @signature
 *    R.merge(b)(a)
 * @example
 *    R.merge({ y: 10, z: 2 })({ x: 1, y: 2 }) // => { x: 1, y: 10, z: 2 }
 * @dataLast
 * @category Object
 */
export function merge<A, B>(b: B): (a: A) => A & B;

export function merge(): unknown {
  return purry(_merge, arguments);
}

function _merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}
