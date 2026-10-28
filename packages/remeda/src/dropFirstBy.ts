import { heapify, heapMaybeInsert } from "./internal/heap";
import { SKIP_ITEM } from "./internal/lazyControl";
import { lazyDataLastImplementation } from "./internal/lazyDataLastImplementation";
import {
  isOrderRule,
  orderRuleComparer,
  type OrderRule,
} from "./internal/purryOrderRules";
import type { CompareFunction } from "./internal/types/CompareFunction";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

type Rules = Readonly<NonEmptyArray<OrderRule<unknown>>>;
type DataFirstArgs = readonly [
  data: readonly unknown[],
  n: number,
  ...rules: Rules,
];
type DataLastArgs = readonly [n: number, ...rules: Rules];

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
 *   dropFirstBy(data, n, ...rules);
 * @example
 *   dropFirstBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['aaaa', 'aaa']
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropFirstBy<T>(
  data: readonly T[],
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): T[];

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria. This allows you to avoid sorting the array before dropping the items. The complexity of this function is *O(Nlogn)* where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeFirstBy`.
 *
 * @param n - The number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A subset of the input array.
 * @signature
 *   dropFirstBy(n, ...rules)(data);
 * @example
 *   pipe(['aa', 'aaaa', 'a', 'aaa'], dropFirstBy(2, x => x.length)); // => ['aaaa', 'aaa']
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropFirstBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<NoInfer<T>>>>
): (data: readonly T[]) => T[];

export function dropFirstBy(...args: DataFirstArgs | DataLastArgs): unknown {
  if (isDataFirst(args)) {
    const [data, n, ...rules] = args;
    return dropFirstByImplementation(data, orderRuleComparer(...rules), n);
  }

  const [n, ...rules] = args;
  // The comparer is stateless, so every run of the data-last function can
  // share the one built here.
  const compareFn = orderRuleComparer(...rules);
  return lazyDataLastImplementation(
    dropFirstByImplementation,
    [compareFn, n],
    lazyImplementation,
  );
}

const isDataFirst = (
  args: DataFirstArgs | DataLastArgs,
): args is DataFirstArgs =>
  // The data-last form starts with `n`, so its 2nd argument is a rule already.
  !isOrderRule(args[1]);

function dropFirstByImplementation<T>(
  data: readonly T[],
  compareFn: CompareFunction<T>,
  n: number,
): T[] {
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
    out.push(heapMaybeInsert(heap, compareFn, item));
  }

  return out;
}

function lazyImplementation<T>(
  compareFn: CompareFunction<T>,
  n: number,
): LazyEvaluator<T> {
  if (Number.isNaN(n) || n < 1) {
    return (item) => item;
  }

  if (n === Infinity) {
    // Nothing is ever passed on, so there's no point holding items back.
    return () => SKIP_ITEM;
  }

  const heapSize = Math.floor(n);
  const heap: T[] = [];
  return (item, index) => {
    if (index < heapSize) {
      heap.push(item);
      return SKIP_ITEM;
    }

    if (index === heapSize) {
      // Like data-first, the heap is built in one go, as ties are broken by
      // its shape, and only once there's an item beyond the first `n`, so
      // `compareFn` is never called on shorter inputs.
      heapify(heap, compareFn);
    }

    return heapMaybeInsert(heap, compareFn, item);
  };
}
