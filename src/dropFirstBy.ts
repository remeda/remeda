import { heapSiftDown, heapify } from './_heap';
import {
  CompareFunction,
  OrderRule,
  purryOrderRulesWithNumberArgument,
} from './_purryOrderRules';
import { NonEmptyArray } from './_types';

/**
 * Drop the first `n` items from `data` based on the provided ordering criteria.
 *
 * This allows you to avoid sorting the array before dropping the items. The complexity of this function is O(Nlogn) where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeBy`.
 *
 * @params data - the input array
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
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
 * Drop the first `n` items from `data` based on the provided ordering criteria.
 *
 * This allows you to avoid sorting the array before dropping the items. The complexity of this function is O(Nlogn) where `N` is the length of the array.
 *
 * For the opposite operation (to keep `n` elements) see `takeBy`.
 *
 * @params data - the input array
 * @params n - the number of items to drop. If `n` is non-positive no items would be dropped and a *clone* of the input would be returned, if `n` is bigger then data.length no items would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
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
  return purryOrderRulesWithNumberArgument(
    dropFirstByImplementation,
    arguments
  );
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

  const out: Array<T> = [];

  const rest = data.slice(n);
  for (const item of rest) {
    if (compareFn(item, heap[0]) < 0) {
      // Every time we change the head of the heap it means the existing head
      // would not be dropped, so we add it to the output.
      out.push(heap[0]);
      heap[0] = item;
      heapSiftDown(heap, 0, compareFn);
    } else {
      out.push(item);
    }
  }

  return out;
}
