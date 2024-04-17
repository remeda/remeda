import { _reduceLazy } from "./_reduceLazy";
import { lazyIdentityEvaluator } from "./_utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. If either `array` or `other` contain multiple items with the
 * same values, all occurrences of those values will be removed. If the exact
 * number of copies should be observed (i.e. multi-set semantics), use
 * `R.difference.multiset` instead. If the arrays don't contain duplicates, both
 * implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.difference.multiset(data, other)` (or `R.filter(data, R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(data, other)
 *    R.difference.multiset(data, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    R.difference([1, 1, 2, 2], [1]); // => [2, 2]
 *    R.difference.multiset([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.difference.multiset(data, other)` (or `R.filter(data, R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 */
export function difference<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. If either `array` or `other` contain multiple items with the
 * same values, all occurrences of those values will be removed. If the exact
 * number of copies should be observed (i.e. multi-set semantics), use
 * `R.difference.multiset` instead. If the arrays don't contain duplicates, both
 * implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.difference.multiset(other)` (or `R.filter(R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(data)
 *    R.difference.multiset(other)(data)
 * @example
 *    R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
 *    R.pipe([1, 1, 2, 2], R.difference([1])); // => [2, 2]
 *    R.pipe([1, 1, 2, 2], R.difference.multiset([1])); // => [1, 2, 2]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.difference.multiset(other)` (or `R.filter(R.isNot(R.isIncludedIn(other)))` to keep the current runtime logic). `R.difference.multiset` will replace `R.difference` in v2!
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
  if (other.length === 0) {
    return lazyIdentityEvaluator;
  }

  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  return (value) => {
    const copies = remaining.get(value);

    if (copies === undefined || copies === 0) {
      // The item is either not part of the other array or we've dropped enough
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
