import { heapSiftDown, heapify } from './_heap';
import {
  CompareFunction,
  OrderRule,
  purryOrderRulesWithNumberArgument,
} from './_purryOrderRules';
import { NonEmptyArray } from './_types';

/**
 * Take the first `n` items from `data` based on the provided ordering criteria.
 *
 * This allows you to avoid sorting the array before taking the items. The complexity of this function is O(Nlogn) where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropBy`.
 *
 * @params data - the input array
 * @params n - the number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns a subset of the input array.
 * @signature
 *   R.takeBy(data, n, ...rules);
 * @example
 *   R.takeBy(['aa', 'aaaa', 'a', 'aaa'], 2, x => x.length); // => ['a', 'aa']
 * @dataFirst
 * @category Array
 */
export function takeBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

/**
 * Take the first `n` items from `data` based on the provided ordering criteria.
 *
 * This allows you to avoid sorting the array before taking the items. The complexity of this function is O(Nlogn) where `N` is the length of the array.
 *
 * For the opposite operation (to drop `n` elements) see `dropBy`.
 *
 * @params data - the input array
 * @params n - the number of items to take. If `n` is non-positive no items would be returned, if `n` is bigger then data.length a *clone* of `data` would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns a subset of the input array.
 * @signature
 *   R.takeBy(n, ...rules)(data);
 * @example
 *   R.pipe(['aa', 'aaaa', 'a', 'aaa'], R.takeBy(2, x => x.length)); // => ['a', 'aa']
 * @dataLast
 * @category Array
 */
export function takeBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

export function takeBy(): unknown {
  return purryOrderRulesWithNumberArgument(takeByImplementation, arguments);
}

function takeByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number
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
    if (compareFn(item, heap[0]) < 0) {
      heap[0] = item;
      heapSiftDown(heap, 0, compareFn);
    }
  }

  return heap;
}
