import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    difference(data, other)
 * @example
 *    difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(data: readonly T[], other: readonly T[]): T[];

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param other - The values to exclude.
 * @signature
 *    difference(other)(data)
 * @example
 *    pipe([1, 2, 3, 4], difference([2, 5, 3])); // => [1, 4]
 *    pipe([1, 1, 2, 2], difference([1])); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function difference<T>(other: readonly T[]): (data: readonly T[]) => T[];

export function difference(...args: readonly unknown[]): unknown {
  return purryWithLazy(differenceImplementation, args, lazyImplementation);
}

function differenceImplementation<T>(
  data: readonly T[],
  other: readonly T[],
): T[] {
  // Each copy in `other` excludes a single occurrence from `data`, so the map
  // counts the copies that are still unused.
  const remaining = new Map<T, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  const result: T[] = [];
  for (const value of data) {
    const copies = remaining.get(value);
    if (copies === undefined || copies === 0) {
      result.push(value);
    } else {
      remaining.set(value, copies - 1);
    }
  }
  return result;
}

function lazyImplementation<T>(other: readonly T[]): LazyEvaluator<T> {
  if (other.length === 0) {
    return (value) => value;
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
      return value;
    }

    // The item is equal to an item in the other array and there are still
    // copies of it to "account" for so we skip this one and remove it from our
    // ongoing tally.
    remaining.set(value, copies - 1);
    return SKIP_ITEM;
  };
}
