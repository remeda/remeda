import {
  CompareFunction,
  OrderRule,
  purryOrderRulesWithNumberArgument,
} from './_purryOrderRules';
import { quickSelect } from './_quickSelect';
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

const atIndexByImplementation = <T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  index: number
): T | undefined =>
  quickSelect(
    data,
    // Allow negative indices gracefully
    index >= 0 ? index : data.length + index,
    compareFn
  );
