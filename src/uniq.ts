import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * @param array - The array to filter.
 * @signature
 *    R.uniq(array)
 * @example
 *    R.uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function uniq<T>(array: ReadonlyArray<T>): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * @param array - The array to filter.
 * @signature
 *    R.uniq()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.uniq(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function uniq<T>(): (array: ReadonlyArray<T>) => Array<T>;

export function uniq(): unknown {
  return purry(_uniq, arguments, uniq.lazy);
}

function _uniq<T>(array: ReadonlyArray<T>): Array<T> {
  return _reduceLazy(array, uniq.lazy());
}

export namespace uniq {
  export function lazy<T>(): LazyEvaluator<T> {
    const set = new Set<T>();
    return (value) => {
      if (set.has(value)) {
        return { done: false, hasNext: false };
      }
      set.add(value);
      return { done: false, hasNext: true, next: value };
    };
  }
}
