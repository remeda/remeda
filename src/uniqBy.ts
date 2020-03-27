import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';

export function uniqBy<T, K>(
  transformer: (item: T) => K,
  array: readonly T[]
): T[];

/**
 * Returns a new array containing only one copy of each element in the original list transformed by a function.
 * Elements are compared by reference using Set.
 * @param array
 * @signature
 *    R.uniqBy(fn, array)
 * @example
 *    R.uniq(obj => obj.n, [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}]) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniq(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @pipeable
 * @category Array
 */

export function uniqBy<T, K>(
  transformer: (item: T) => K
): (array: readonly T[]) => T[];

export function uniqBy() {
  return purry(_uniqBy, arguments, lazyUniqBy);
}

function _uniqBy<T, K>(transformer: (item: T) => K, array: T[]) {
  return _reduceLazy(array, lazyUniqBy(transformer));
}

function lazyUniqBy(transformer: (item: any) => any) {
  const set = new Set<any>();
  return (value: any): LazyResult<any> => {
    const appliedItem = transformer(value);
    if (set.has(appliedItem)) {
      return {
        done: false,
        hasNext: false,
      };
    }

    set.add(appliedItem);
    return {
      done: false,
      hasNext: true,
      next: value,
    };
  };
}
