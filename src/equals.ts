/* eslint-disable jsdoc/check-param-names -- ignore for deprecated files */

import { purry } from "./purry";

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 *
 * ! **DEPRECATED**: Use `R.isDeepEqual(a, b)`. Will be removed in V2.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @signature
 *    R.equals(a, b)
 * @example
 *    R.equals(1, 1) //=> true
 *    R.equals(1, '1') //=> false
 *    R.equals([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Object
 * @deprecated Use `R.isDeepEqual(a, b)`. Will be removed in V2.
 */
export function equals(a: unknown, b: unknown): boolean;

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 *
 * ! **DEPRECATED**: Use `R.isDeepEqual(b)(a)`. Will be removed in V2.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @signature
 *    R.equals(b)(a)
 * @example
 *    R.equals(1)(1) //=> true
 *    R.equals('1')(1) //=> false
 *    R.equals([1, 2, 3])([1, 2, 3]) //=> true
 * @dataLast
 * @category Object
 * @deprecated Use `R.isDeepEqual(b)(a)`. Will be removed in V2.
 */
export function equals(a: unknown): (b: unknown) => boolean;

export function equals(): unknown {
  return purry(_equals, arguments);
}

function _equals(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a === "number" && typeof b === "number") {
    // TODO: This is a temporary fix for NaN, we should use Number.isNaN once we bump our target above ES5.
    // eslint-disable-next-line no-self-compare -- We should use Number.isNaN here, but it's ES2015.
    return a !== a && b !== b;
  }

  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  if (a === null || b === null) {
    return false;
  }

  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);

  if (isArrayA && isArrayB) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!_equals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (isArrayA !== isArrayB) {
    return false;
  }

  const isDateA = a instanceof Date;
  const isDateB = b instanceof Date;
  if (isDateA && isDateB) {
    return a.getTime() === b.getTime();
  }
  if (isDateA !== isDateB) {
    return false;
  }

  const isRegExpA = a instanceof RegExp;
  const isRegExpB = b instanceof RegExp;
  if (isRegExpA && isRegExpB) {
    return a.toString() === b.toString();
  }
  if (isRegExpA !== isRegExpB) {
    return false;
  }

  const keys = Object.keys(a);

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }

    // @ts-expect-error [ts7053] - There's no easy way to tell typescript these keys are safe.
    if (!_equals(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
