import { _reduceLazy } from "./_reduceLazy";
import { _toLazyIndexed } from "./_toLazyIndexed";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param array - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    R.uniqueWith(array, isEquals)
 * @example
 *    R.uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Array
 * @mapping lodash uniqWith
 * @mapping ramda uniqWith
 */
export function uniqueWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature R.uniqueWith(isEquals)(array)
 * @example
 *    R.uniqueWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqueWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Object
 * @mapping lodash uniqWith
 * @mapping ramda uniqWith
 */
export function uniqueWith<T>(
  isEquals: IsEquals<T>,
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqueWith(): unknown {
  return purry(uniqueWithImplementation, arguments, uniqueWith.lazy);
}

function uniqueWithImplementation<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T> {
  const lazy = uniqueWith.lazy(isEquals);
  return _reduceLazy(array, lazy, true);
}

const _lazy =
  <T>(isEquals: IsEquals<T>): LazyEvaluator<T> =>
  (value, index, array) =>
    array !== undefined &&
    array.findIndex((otherValue) => isEquals(value, otherValue)) === index
      ? { done: false, hasNext: true, next: value }
      : { done: false, hasNext: false };

export namespace uniqueWith {
  export const lazy = _toLazyIndexed(_lazy);
}
