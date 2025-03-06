import { heapify, heapMaybeInsert } from "./internal/heap";
import {
  purryOrderRulesWithArgument,
  type OrderRule,
} from "./internal/purryOrderRules";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type { CompareFunction } from "./internal/types/CompareFunction";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param data - The input array.
 * @param n - The number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.dropFirstBy(data, n, ...rules);
 * @example
 *   R.dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaa', 'aaaa']
 * @dataFirst
 * @category Array
 */
export function dropFirstBy<T>(
  data: Iterable<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param n - The number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   R.dropFirstBy(n, ...rules)(data);
 * @example
 *   R.pipe(['aa', 'aaaa', 'a', 'aaa'], R.dropFirstBy(2, x => x.length)); // => ['aaa', 'aaaa']
 * @dataLast
 * @category Array
 */
export function dropFirstBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: Iterable<T>) => Array<T>;

export function dropFirstBy(...args: ReadonlyArray<unknown>): unknown {
  return purryOrderRulesWithArgument(dropFirstByImplementation, args);
}

function dropFirstByImplementation<T>(
  data: Iterable<T>,
  compareFn: CompareFunction<T>,
  n: number,
): Array<T> {
  const array = toReadonlyArray(data);

  if (n >= array.length) {
    return [];
  }

  if (n <= 0) {
    return [...array];
  }

  const heap = array.slice(0, n);
  heapify(heap, compareFn);

  const out = [];

  const rest = array.slice(n);
  for (const item of rest) {
    const previousHead = heapMaybeInsert(heap, compareFn, item);
    out.push(previousHead ?? item);
  }

  return out;
}
