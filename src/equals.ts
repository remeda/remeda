import { purry } from "./purry";

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 * @param a the first object to compare
 * @param b the second object to compare
 * @signature
 *    R.equals(a, b)
 * @example
 *    R.equals(1, 1) //=> true
 *    R.equals(1, '1') //=> false
 *    R.equals([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Object
 */
export function equals(a: unknown, b: unknown): boolean;

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * NOTE: Doesn't handle cyclical data structures.
 * @param a the first object to compare
 * @param b the second object to compare
 * @signature
 *    R.equals(b)(a)
 * @example
 *    R.equals(1)(1) //=> true
 *    R.equals('1')(1) //=> false
 *    R.equals([1, 2, 3])([1, 2, 3]) //=> true
 * @dataLast
 * @category Object
 */
export function equals(a: unknown): (b: unknown) => boolean;

export function equals() {
  return purry(_equals, arguments);
}

function _equals(a: unknown, b: unknown) {
  if (a === b) {
    return true;
  }

  if (typeof a !== "object" || typeof b !== "object") {
    return Number.isNaN(a) && Number.isNaN(b);
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
      if (!equals(a[i], b[i])) {
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
  }

  for (const key of keys) {
    // @ts-expect-error [ts7053] - There's no easy way to tell typescript these keys are safe.
    if (!equals(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
