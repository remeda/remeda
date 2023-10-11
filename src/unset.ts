import { isNil } from './isNil';
import { purry } from './purry';

/**
 * Remove the `prop` of `obj`.
 * @param obj the target object
 * @param prop the property name
 * @signature
 *    R.unset(obj, prop)
 * @example
 *    R.unset({ a: 1, b: 2 }, 'a') // => { b: 2 }
 * @dataFirst
 * @category Object
 */
export function unset<T, K extends PropertyKey>(obj: T, prop: K): Omit<T, K>;

/**
 * Remove the `prop`  of `obj`.
 * @param obj the target object
 * @param prop the property name
 * @signature
 *    R.unset(prop)(obj)
 * @example
 *    R.pipe({ a: 1, b: 2 }, R.unset('a')) // => { b: 2 }
 * @dataLast
 * @category Object
 */
export function unset<T, K extends PropertyKey>(
  prop: K
): (obj: T) => Omit<T, K>;

export function unset() {
  return purry(_unset, arguments);
}

function _unset(obj: Record<PropertyKey, any>, prop: PropertyKey) {
  if (isNil(obj)) {
    return obj;
  }

  const result = { ...obj };
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- for efficiency
  delete result[prop];
  return result;
}

interface Strict {
  // Data-First
  <T, K extends keyof T>(obj: T, prop: K): Omit<T, K>;

  // Data-Last
  <T, K extends keyof T>(prop: K): (obj: T) => Omit<T, K>;
}

export namespace unset {
  export const strict: Strict = unset;
}
