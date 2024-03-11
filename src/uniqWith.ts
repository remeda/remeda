import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 * @param array
 * @param isEquals the comparator
 * @signature
 *    R.uniqWith(array, isEquals)
 * @example
 *    R.uniqWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      R.equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @category Array
 */
export function uniqWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by custom comparator isEquals.
 * @param isEquals the comparator
 * @signature R.uniqWith(isEquals)(array)
 * @example
 *    R.uniqWith(R.equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    R.pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      R.uniqWith(R.equals),
 *      R.take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @category Object
 */
export function uniqWith<T>(
  isEquals: IsEquals<T>,
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqWith(): unknown {
  return purry(_uniqWith, arguments, _lazy);
}

function _uniqWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>,
): Array<T> {
  return _reduceLazy(array, _lazy(isEquals));
}

const _lazy =
  <T>(isEquals: IsEquals<T>): LazyEvaluator<T> =>
  (value, index, array) =>
    array.findIndex((otherValue) => isEquals(value, otherValue)) === index
      ? { done: false, hasNext: true, next: value }
      : { done: false, hasNext: false };
