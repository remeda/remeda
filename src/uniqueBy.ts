import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
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
 * @similarTo lodash uniqBy
 * @similarTo ramda uniqBy
 */
export function uniqueBy<T, K>(
  data: ReadonlyArray<T>,
  keyFunction: (item: T) => K,
): Array<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
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
 * @similarTo lodash uniqBy
 * @similarTo ramda uniqBy
 */
export function uniqueBy<T, K>(
  keyFunction: (item: T) => K,
): (data: ReadonlyArray<T>) => Array<T>;

export function uniqueBy(): unknown {
  return purry(uniqueByImplementation, arguments, lazyUniqueBy);
}

function uniqueByImplementation<T, K>(
  data: ReadonlyArray<T>,
  keyFunction: (item: T) => K,
): Array<T> {
  return _reduceLazy(data, lazyUniqueBy(keyFunction));
}

function lazyUniqueBy<T, K>(keyFunction: (item: T) => K): LazyEvaluator<T> {
  const set = new Set<K>();
  return (value) => {
    const key = keyFunction(value);
    if (set.has(key)) {
      return { done: false, hasNext: false };
    }

    set.add(key);
    return { done: false, hasNext: true, next: value };
  };
}
