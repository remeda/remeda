import { heapify, heapMaybeInsert } from './_heap';
import { OrderRule, purryOrderRulesWithArgument } from './_purryOrderRules';
import type { CompareFunction, NonEmptyArray } from './_types';

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see {@link takeFirstBy}.
 *
 * @params data - the input array
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns a subset of the input array.
 * @signature
 *   R.dropFirstBy(data, n, ...rules);
 * @example
 *   R.dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaa', 'aaaa']
 * @dataFirst
 * @category Array
 */
export function dropFirstBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see {@link takeFirstBy}.
 *
 * @params data - the input array
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns a subset of the input array.
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
): (data: ReadonlyArray<T>) => Array<T>;

export function dropFirstBy(): unknown {
  return purryOrderRulesWithArgument(dropFirstByImplementation, arguments);
}

function dropFirstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number
): Array<T> {
  if (n >= data.length) {
    return [];
  }

  if (n <= 0) {
    return [...data];
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const out = [];

  const rest = data.slice(n);
  for (const item of rest) {
    const previousHead = heapMaybeInsert(heap, compareFn, item);
    out.push(previousHead ?? item);
  }

  return out;
}
