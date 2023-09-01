import { purry } from './purry';
import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';

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
 * @data_first
 * @category Array
 */
export function uniqWith<T>(
  array: ReadonlyArray<T>,
  isEquals: IsEquals<T>
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
 * @data_last
 * @category Object
 */
export function uniqWith<T>(
  isEquals: IsEquals<T>
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqWith() {
  return purry(_uniqWith, arguments, uniqWith.lazy);
}

function _uniqWith<T>(array: Array<T>, isEquals: IsEquals<T>) {
  const lazy = uniqWith.lazy(isEquals);
  return _reduceLazy(array, lazy, true);
}

function _lazy<T>(isEquals: IsEquals<T>) {
  return (
    value: T,
    index?: number,
    array?: ReadonlyArray<T>
  ): LazyResult<T> => {
    if (
      array &&
      array.findIndex(otherValue => isEquals(value, otherValue)) === index
    ) {
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    }
    return {
      done: false,
      hasNext: false,
    };
  };
}

export namespace uniqWith {
  export const lazy = _toLazyIndexed(_lazy);
}
