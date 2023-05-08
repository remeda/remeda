import { isArray } from './isArray';
import { isObject } from './isObject';
import { isString } from './isString';

/**
 * A function that checks if the passed parameter is empty
 * @param data the variable to check
 * @signature
 *    R.isEmpty(data)
 * @returns true if the passed input is empty, false otherwise
 * @example
 *    R.isEmpty('') //=> true
 *    R.isEmpty([]) //=> true
 *    R.isEmpty({}) //=> true
 *    R.isEmpty('test') //=> false
 *    R.isEmpty([1, 2, 3]) //=> false
 *    R.isEmpty({ length: 0 }) //=> false
 * @category Function
 */
export function isEmpty(data: string): data is '';
export function isEmpty(data: ReadonlyArray<unknown> | []): data is [];
export function isEmpty<T extends Readonly<Record<PropertyKey, unknown>>>(
  data: T
): data is Record<keyof T, never>;
export function isEmpty(data: unknown): boolean {
  if (isArray(data) || isString(data)) {
    return data.length === 0;
  }
  if (isObject(data)) {
    return Object.keys(data).length === 0;
  }
  return false;
}
