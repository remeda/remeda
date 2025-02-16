import { purryFromLazy } from "./internal/purryFromLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { SKIP_ITEM, lazyEmptyEvaluator } from "./internal/utilityEvaluators";

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(data, other)
 * @example
 *    R.intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
 *    R.intersection([1, 1, 2, 2], [1]); // => [1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function intersection<T, S>(
  data: ReadonlyArray<T>,
  other: ReadonlyArray<S>,
): Array<S & T>;

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param other - The items to compare against.
 * @signature
 *    R.intersection(other)(data)
 * @example
 *    R.pipe([1, 2, 3], R.intersection([2, 3, 5])); // => [2, 3]
 *    R.pipe([1, 1, 2, 2], R.intersection([1])); // => [1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function intersection<S>(
  other: ReadonlyArray<S>,
): <T>(data: ReadonlyArray<T>) => Array<S & T>;

export function intersection(...args: ReadonlyArray<unknown>): unknown {
  return purryFromLazy(lazyImplementation, args);
}

function lazyImplementation<T, S>(
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
      return SKIP_ITEM;
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
