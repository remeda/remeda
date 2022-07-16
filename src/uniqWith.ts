import { purry } from './purry';
import { LazyResult, _reduceLazy } from './_reduceLazy';
import { _toLazyIndexed } from './_toLazyIndexed';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * @param array
 * @param isEquals the comparator
 * @signature
 *    R.uniqWith(array, isEquals)
 * @example
 *    R.uniqWith([1, 2, 2, 5, 1, 6, 7], R.equals) // => [1, 2, 5, 6, 7]
 * @data_first
 * @category Array
 */
export function uniqWith<T>(array: readonly T[], isEquals: IsEquals<T>): T[];

/**
 * Returns a new array containing only one copy of each element in the original list.
 * @param isEquals the comparator
 * @signature R.uniqWith(isEquals)(array)
 * @example
 *    R.uniqWith([2, 5, 3], R.equals)([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.uniqWith(R.equals),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @data_last
 * @category Object
 */
export function uniqWith<T>(isEquals: IsEquals<T>): (array: readonly T[]) => T[];

export function uniqWith() {
  return purry(_uniqWith, arguments, uniqWith.lazy);
}

function _uniqWith<T>(array: T[], isEquals: IsEquals<T>) {
  const lazy = uniqWith.lazy(isEquals)
  return _reduceLazy(array, lazy, true);
}

function _lazy<T>(isEquals: IsEquals<T>) {
  return (value: T, index?: number, array?: T[]): LazyResult<T> => {
    if (array && array.findIndex((otherValue) => isEquals(value, otherValue)) === index) {
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
  export const lazy = _toLazyIndexed(_lazy)
}
