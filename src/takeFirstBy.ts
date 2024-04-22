import { heapify, heapMaybeInsert } from "./internal/heap";
import {
  purryOrderRulesWithArgument,
  type OrderRule,
} from "./internal/purryOrderRules";
import type { CompareFunction, NonEmptyArray } from "./internal/types";

/**
 * Take the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before taking the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropFirstBy`.
 *
 * @param data - The input array.
 * @param n - The number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.takeFirstBy(data, n, ...rules);
 * @example
 *   R.takeFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['a', 'aa']
 * @dataFirst
 * @category Array
 */
export function takeFirstBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

/**
 * Take the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before taking the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropFirstBy`.
 *
 * @param n - The number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.takeFirstBy(n, ...rules)(data);
 * @example
 *   R.pipe(['aa', 'aaaa', 'a', 'aaa'], R.takeFirstBy(2, x => x.length)); // => ['a', 'aa']
 * @dataLast
 * @category Array
 */
export function takeFirstBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

export function takeFirstBy(...args: ReadonlyArray<unknown>): unknown {
  return purryOrderRulesWithArgument(takeFirstByImplementation, args);
}

function takeFirstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number,
): Array<T> {
  if (n <= 0) {
    return [];
  }

  if (n >= data.length) {
    return [...data];
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const rest = data.slice(n);
  for (const item of rest) {
    heapMaybeInsert(heap, compareFn, item);
  }

  return heap;
}
