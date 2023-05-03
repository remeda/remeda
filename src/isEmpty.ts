import { isArray } from './isArray';
import { isObject } from './isObject';
import { isString } from './isString';

type Data =
  | ReadonlySet<unknown>
  | ReadonlyMap<unknown, unknown>
  | ArrayLike<unknown>
  | string
  | Record<string, unknown>;

/**
 * A function that checks if the passed parameter is empty
 * @param data the variable to check
 * @signature
 *    R.isEmpty(data)
 * @returns true if the passed input is empty, false otherwise
 * @example
 *    R.isEmpty([]) //=> true
 *    R.isEmpty({}) //=> true
 *    R.isEmpty('') //=> true
 *    R.isEmpty(new Set()) //=> true
 *    R.isEmpty(new Map()) //=> true
 *    R.isEmpty([1, 2, 3]) //=> false
 *    R.isEmpty({ length: 0 }) //=> false
 * @category Function
 */
export function isEmpty(data: Data): boolean {
  if (data instanceof Set || data instanceof Map) {
    return data.size === 0;
  }
  if (isArray(data) || isString(data)) {
    return data.length === 0;
  }
  if (isObject(data)) {
    return Object.keys(data).length === 0;
  }
  return false;
}
