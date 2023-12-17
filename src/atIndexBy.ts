import { heapSiftDown, heapify } from './_heap';
import {
  CompareFunction,
  OrderRule,
  purryOrderRulesWithNumberArgument,
} from './_purryOrderRules';
import { IterableContainer, NonEmptyArray } from './_types';

/**
 * Find the item at the given index/rank in the sorted array, without needing to sort the array before hand. This allows finding the item in O(nlogk) time where n is the size of the array and k is the index, instead of O(nlogn). It is equivalent to `sortBy(data, ...rules)[index]`.
 *
 * See also `firstBy` which provides a stricter return type, but doesn't provide a flexible index param. See `takeBy` to get all the elements up to and including `index`.
 *
 * @params data - the input array
 * @param index - The index of the item to find. If `index` is negative the item at `data.length + index` would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns the item at the given index, or `undefined` if the `index` is out of bounds.
 * @signature
 *   R.atIndexBy(data, index, ...rules);
 * @example
 *   R.atIndexBy([2,1,4,5,3,], 2, identity); // => 3
 * @dataFirst
 * @category Array
 */
export function atIndexBy<T extends IterableContainer>(
  data: T,
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): T[number] | undefined;

/**
 * Find the item at the given index/rank in the sorted array, without needing to sort the array before hand. This allows finding the item in O(nlogk) time where n is the size of the array and k is the index, instead of O(nlogn). It is equivalent to `sortBy(data, ...rules)[index]`.
 *
 * See also `firstBy` which provides a stricter return type, but doesn't provide a flexible index param. See `takeBy` to get all the elements up to and including `index`.
 *
 * @params data - the input array
 * @param index - The index of the item to find. If `index` is negative the item at `data.length + index` would be returned.
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns the item at the given index, or `undefined` if the `index` is out of bounds.
 * @signature
 *   R.atIndexBy(index, ...rules)(data);
 * @example
 *   R.pipe([2,1,4,5,3,], R.atIndexBy(2, identity)); // => 3
 * @dataLast
 * @category Array
 */
export function atIndexBy<T extends IterableContainer>(
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => T[number] | undefined;

export function atIndexBy(): unknown {
  return purryOrderRulesWithNumberArgument(atIndexByImplementation, arguments);
}

function atIndexByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  index: number
): T | undefined {
  // Allow negative indices gracefully
  const realIndex = index >= 0 ? index : data.length + index;

  if (realIndex < 0 || realIndex >= data.length) {
    // Index is overflowing
    return;
  }

  // The performance of the algorithm depends on the index because we need to
  // build a heap of that size, but the algorithm is also symmetric if we flip
  // the compareFn. This allows us to always pick the smaller of two indices to
  // work with.
  const isFlipped = realIndex > data.length / 2;
  const actualIndex = isFlipped ? data.length - realIndex - 1 : realIndex;
  const actualCompareFn: CompareFunction<T> = isFlipped
    ? (a, b) => -compareFn(a, b)
    : compareFn;

  // We build a max-heap of size `index` that will keep the **smallest** values
  // of the array. This means that when we finish checking all values the heap
  // would contain the `index` smallest values, and the root of the heap would
  // contain the largest of them (by definition), which is exactly the item at
  // `index` in the sorted array.
  const heap = data.slice(0, actualIndex + 1);
  heapify(heap, actualCompareFn);

  const rest = data.slice(actualIndex + 1);
  for (const item of rest) {
    if (actualCompareFn(item, heap[0]) < 0) {
      heap[0] = item;
      heapSiftDown(heap, 0, actualCompareFn);
    }
  }

  return heap[0];
}
