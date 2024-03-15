import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param array - The array to filter.
 * @signature
 *    R.uniqueBy(array, fn)
 * @example
 *    R.uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export function uniqueBy<T, K>(
  array: ReadonlyArray<T>,
  transformer: (item: T) => K,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param array - The array to filter.
 * @signature
 *    R.uniqueBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniqueBy(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @pipeable
 * @category Array
 */
export function uniqueBy<T, K>(
  transformer: (item: T) => K,
): (array: ReadonlyArray<T>) => Array<T>;

export function uniqueBy(): unknown {
  return purry(uniqueByImplementation, arguments, lazyuniqueBy);
}

function uniqueByImplementation<T, K>(
  array: ReadonlyArray<T>,
  transformer: (item: T) => K,
): Array<T> {
  return _reduceLazy(array, lazyuniqueBy(transformer));
}

function lazyuniqueBy<T, K>(transformer: (item: T) => K): LazyEvaluator<T> {
  const set = new Set<K>();
  return (value) => {
    const appliedItem = transformer(value);
    if (set.has(appliedItem)) {
      return { done: false, hasNext: false };
    }

    set.add(appliedItem);
    return { done: false, hasNext: true, next: value };
  };
}
