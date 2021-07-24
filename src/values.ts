import { purry } from './purry';

function _values<T>(object: { [key: string]: T } | ArrayLike<T>) {
  return Object.values(object) as T[];
}

/**
 * Returns a new array containing the values of the array or object.
 * @param object
 * @signature
 *    R.values(object)
 * @example
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' }, // only 4 iterations
 *      R.values,
 *      R.first
 *    ) // => 'x'
 * @pipeable
 * @category Object
 */
// data-first
export function values<T>(object: { [key: string]: T } | ArrayLike<T>): T[];

// data-last
export function values<T>(): (
  object: { [key: string]: T } | ArrayLike<T>
) => T[];

export function values() {
  return purry(_values, arguments);
}
