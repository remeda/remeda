import { _reduceLazy } from "./_reduceLazy";
import { lazyEmptyEvaluator } from "./_utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. If either `array` or `other` contain multiple items
 * with the same values, all occurrences of those values will be present. If the
 * exact number of copies should be observed (i.e. multi-set semantics), use
 * `R.intersection.multiset` instead. If the arrays don't contain duplicates,
 * both implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.intersection.multiset(data, other)` (or `R.filter(data, R.isIncludedIn(other))` to keep current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 *
 * @param data - The input items.
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(data, other)
 *    R.intersection.multiset(data, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
 *    R.intersection([1, 1, 2, 2], [1]); // => [1, 1]
 *    R.intersection.multiset([1, 1, 2, 2], [1]); // => [1]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.intersection.multiset(data, other)` (or `R.filter(data, R.isIncludedIn(other))` to keep current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 */
export function intersection<T>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T>;

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. If either `array` or `other` contain multiple items
 * with the same values, all occurrences of those values will be present. If the
 * exact number of copies should be observed (i.e. multi-set semantics), use
 * `R.intersection.multiset` instead. If the arrays don't contain duplicates,
 * both implementations yield the same result.
 *
 * ! **DEPRECATED**: Use `R.intersection.multiset(other)` (or `R.filter(R.isIncludedIn(other))` to keep current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 *
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(other)(data)
 *    R.intersection.multiset(other)(data)
 * @example
 *    R.pipe([1, 2, 3], R.intersection([2, 3, 5])); // => [2, 3]
 *    R.pipe([1, 1, 2, 2], R.intersection([1])); // => [1, 1]
 *    R.pipe([1, 1, 2, 2], R.intersection.multiset([1])); // => [1]
 * @dataFirst
 * @pipeable
 * @category Array
 * @deprecated Use `R.intersection.multiset(other)` (or `R.filter(R.isIncludedIn(other))` to keep current runtime logic). `R.intersection.multiset` will replace `R.intersection` in v2!
 */
export function intersection<T, K>(
  other: ReadonlyArray<T>,
): (source: ReadonlyArray<K>) => Array<T>;

export function intersection(): unknown {
  return purry(_intersection, arguments, intersection.lazy);
}

function _intersection<T>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<T>,
): Array<T> {
  const lazy = intersection.lazy(other);
  return _reduceLazy(array, lazy);
}

export namespace intersection {
  export function lazy<T>(other: ReadonlyArray<T>): LazyEvaluator<T> {
    const set = new Set(other);
    return (value) =>
      set.has(value)
        ? { done: false, hasNext: true, next: value }
        : { done: false, hasNext: false };
  }

  export function multiset<T, S>(
    array: ReadonlyArray<T>,
    other: ReadonlyArray<S>,
  ): Array<S & T>;
  export function multiset<S>(
    other: ReadonlyArray<S>,
  ): <T>(data: ReadonlyArray<T>) => Array<S & T>;

  export function multiset(): unknown {
    return purry(multisetImplementation, arguments, multisetLazyImplementation);
  }
}

const multisetImplementation = <T, S>(
  array: ReadonlyArray<T>,
  other: ReadonlyArray<S>,
): Array<S & T> => _reduceLazy(array, multisetLazyImplementation(other));

function multisetLazyImplementation<T, S>(
  other: ReadonlyArray<S>,
): LazyEvaluator<T, S & T> {
  if (other.length === 0) {
    return lazyEmptyEvaluator;
  }

  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<S | T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  return (value) => {
    const copies = remaining.get(value);

    if (copies === undefined || copies === 0) {
      // The item is either not part of the other array or we've "used" enough
      // copies of it so we skip the remaining values.
      return { done: false, hasNext: false };
    }

    // The item is equal to an item in the other array and there are still
    // copies of it to "account" for so we return this one and remove it from
    // our ongoing tally.
    if (copies === 1) {
      remaining.delete(value);
    } else {
      remaining.set(value, copies - 1);
    }

    return {
      hasNext: true,
      // We can safely cast here because if value was in the `remaining` map, it
      // has to be of type S (that's just how we built it).
      next: value as S & T,
      // We can stop the iteration if the remaining map is empty.
      done: remaining.size === 0,
    };
  };
}
