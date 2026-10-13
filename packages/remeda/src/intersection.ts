import {
  lastLazyValue,
  lazyEmptyEvaluator,
  SKIP_ITEM,
  type LazyResult,
} from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The items to compare against.
 * @signature
 *    intersection(data, other)
 * @example
 *    intersection([1, 2, 3], [2, 3, 5]); // => [2, 3]
 *    intersection([1, 1, 2, 2], [1]); // => [1]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function intersection<T, S>(
  data: readonly T[],
  other: readonly S[],
): (T & S)[];

/**
 * Returns a list of elements that exist in both array. The output maintains the
 * same order as the input. The inputs are treated as multi-sets/bags (multiple
 * copies of items are treated as unique items).
 *
 * @param other - The items to compare against.
 * @signature
 *    intersection(other)(data)
 * @example
 *    pipe([1, 2, 3], intersection([2, 3, 5])); // => [2, 3]
 *    pipe([1, 1, 2, 2], intersection([1])); // => [1]
 * @dataLast
 * @lazy
 * @category Array
 */
export function intersection<S>(
  other: readonly S[],
): <T>(data: readonly T[]) => (T & S)[];

export function intersection(...args: readonly unknown[]): unknown {
  return purryWithLazy(intersectionImplementation, args, lazyImplementation);
}

function intersectionImplementation<T, S>(
  data: readonly T[],
  other: readonly S[],
): (T & S)[] {
  // Each copy in `other` matches a single occurrence in `data`, so the map
  // counts the copies that are still unmatched. A value leaves the map once
  // all its copies are matched, so an empty map ends the search early.
  const remaining = new Map<T | S, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  const result: (T & S)[] = [];
  for (const value of data) {
    if (remaining.size === 0) {
      return result;
    }

    const copies = remaining.get(value);
    if (copies !== undefined) {
      result.push(
        // @ts-expect-error [ts2345] -- `value` is `T & S` here semantically, but TypeScript can't infer it via this implementation.
        value,
      );

      if (copies === 1) {
        remaining.delete(value);
      } else {
        remaining.set(value, copies - 1);
      }
    }
  }

  return result;
}

function lazyImplementation<T, S>(
  other: readonly S[],
): LazyEvaluator<T, T & S> {
  if (other.length === 0) {
    return lazyEmptyEvaluator;
  }

  // We need to build a more efficient data structure that would allow us to
  // keep track of the number of times we've seen a value in the other array.
  const remaining = new Map<T | S, number>();
  for (const value of other) {
    remaining.set(value, (remaining.get(value) ?? 0) + 1);
  }

  return (value, _index, _data, slot): LazyResult<T & S> => {
    const copies = remaining.get(value);

    if (copies === undefined) {
      // The item is either not part of the other array or all its copies were
      // already matched (they leave the map below), so we skip it.
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

    // We can stop the iteration if the remaining map is empty.
    return remaining.size === 0
      ? // @ts-expect-error [ts2322] -- `value` is `T & S` here semantically, but TypeScript can't infer it via this implementation.
        lastLazyValue(value, slot)
      : // @ts-expect-error [ts2322] -- `value` is `T & S` here semantically, but TypeScript can't infer it via this implementation.
        value;
  };
}
