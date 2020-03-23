import { purry } from './purry';
import { _reduceLazy, LazyResult } from './_reduceLazy';

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * Note: In `pipe`, use `uniq()` form instead of `uniq`. Otherwise, the inferred type is lost.
 * @param array
 * @signature
 *    R.uniq(array)
 * @example
 *    R.uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.uniq(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @pipeable
 * @category Array
 */

export function uniq<T>(array: readonly T[]): T[];
export function uniq<T>(): (array: readonly T[]) => T[];

export function uniq() {
  return purry(_uniq, arguments, uniq.lazy);
}

function _uniq<T>(array: T[]) {
  return _reduceLazy(array, uniq.lazy());
}

export namespace uniq {
  export function lazy() {
    const set = new Set<any>();
    return (value: any): LazyResult<any> => {
      if (set.has(value)) {
        return {
          done: false,
          hasNext: false,
        };
      }
      set.add(value);
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
  }
}
