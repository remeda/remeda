import { purry } from './purry';

function _keys<T>(object: { [key: string]: T } | ArrayLike<T>) {
  return Object.keys(object) as string[];
}

/**
 * Returns a new array containing the keys of the array or object.
 * @param object
 * @signature
 *    R.keys(object)
 * @example
 *    R.keys(['x', 'y', 'z']) // => ['1', '2', '3']
 *    R.keys({ a: 'x', b: 'y', c: 'z' }) // => ['a', 'b', 'c']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' }, // only 4 iterations
 *      R.values,
 *      R.first
 *    ) // => 'a'
 * @pipeable
 * @category Object
 */
// data-first
export function keys<T>(object: { [key: string]: T } | ArrayLike<T>): string[];

// data-last
export function keys<T>(): (
  object: { [key: string]: T } | ArrayLike<T>
) => string[];

export function keys() {
  return purry(_keys, arguments);
}
