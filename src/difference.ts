import { _reduceLazy } from "./_reduceLazy";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Excludes the values from `other` array.
 *
 * ! **DEPRECATED**: The runtime implementation of this function handles duplicate values inconsistently. In v2 a new implementation would replace it; this implementation is accessible to v1 users via the `multiset` variant of this function (`R.difference.multiset`), or to maintain the same runtime implementation use `R.filter(array, R.isNot(R.isIncludedIn(other)))` instead.
 *
 * @param array - The source array.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(array, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]) // => [1, 4]
 * @dataFirst
 * @pipeable
 * @category Deprecated
 * @deprecated The runtime implementation of this function handles duplicate values inconsistently. In v2 a new implementation would replace it; this implementation is accessible to v1 users via the `multiset` variant of this function (`R.difference.multiset`), or to maintain the same runtime implementation use `R.filter(array, R.isNot(R.isIncludedIn(other)))` instead.
 */
export function difference<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Excludes the values from `other` array.
 *
 * ! **DEPRECATED**: Use `R.filter(R.isNot(R.isIncludedIn(other)))`. Will be removed in v2!
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(array)
 * @example
 *    R.difference([2, 5, 3])([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 3, 4, 5, 6], // only 4 iterations
 *      R.difference([2, 3]),
 *      R.take(2)
 *    ) // => [1, 4]
 * @dataLast
 * @pipeable
 * @category Deprecated
 * @deprecated Use `R.filter(R.isNot(R.isIncludedIn(other)))`. Will be removed in v2.
 */
export function difference<T, K>(
  other: ReadonlyArray<T>,
): (array: ReadonlyArray<K>) => Array<T>;

export function difference(): unknown {
  return purry(_difference, arguments, difference.lazy);
}

function _difference<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> {
  const lazy = difference.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace difference {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    const set = new Set(other);
    return (value) =>
      set.has(value)
        ? { done: false, hasNext: false }
        : { done: false, hasNext: true, next: value };
  }

  export function multiset<T>(
    array: ReadonlyArray<T>,
    other: ReadonlyArray<T>,
  ): Array<T>;
  export function multiset<T>(
    other: ReadonlyArray<T>,
  ): (data: ReadonlyArray<T>) => Array<T>;

  export function multiset(): unknown {
    return purry(multisetImplementation, arguments, multisetLazyImplementation);
  }
}

const multisetImplementation = <T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> => _reduceLazy(array, multisetLazyImplementation(other));

function multisetLazyImplementation<T>(
  other: ReadonlyArray<T>,
): LazyEvaluator<T> {
  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  return (value) => {
    const copies = remaining.get(value);

    if (copies === undefined || copies === 0) {
      // The item is either not part of the other array, or we've dropped enough
      // copies of it so we return it.
      return { done: false, hasNext: true, next: value };
    }

    // The item is equal to an item in the other array and there are still
    // copies of it to "account" for so we skip this one and remove it from our
    // ongoing tally.
    remaining.set(value, copies - 1);
    return { done: false, hasNext: false };
  };
}
