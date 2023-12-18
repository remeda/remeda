import {
  CompareFunction,
  OrderRule,
  purryOrderRulesWithArgument,
} from './_purryOrderRules';
import { quickSelect } from './_quickSelect';
import { IterableContainer, NonEmptyArray } from './_types';

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the QuickSelect algorithm running at an average complexity of O(n). Semantically it is equivalent to `sortBy(data, ...rules)[index]` which would run at O(nlogn).
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but. See `takeBy` to get all the elements up to and including `index`.
 *
 * @param data - The input array.
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A set of ordering rules (functions) that define the sorting criteria. Use `[fn, "desc"]` syntax for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nthBy(data, index, ...rules);
 * @example
 *   R.nthBy([2,1,4,5,3,], 2, identity); // => 3
 * @dataFirst
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  data: T,
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): T[number] | undefined;

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the QuickSelect algorithm running at an average complexity of O(n). Semantically it is equivalent to `sortBy(data, ...rules)[index]` which would run at O(nlogn).
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but. See `takeBy` to get all the elements up to and including `index`.
 *
 * @param data - The input array.
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A set of ordering rules (functions) that define the sorting criteria. Use `[fn, "desc"]` syntax for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   R.nthBy(index, ...rules)(data);
 * @example
 *   R.pipe([2,1,4,5,3,], R.nthBy(2, identity)); // => 3
 * @dataLast
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  index: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => T[number] | undefined;

export function nthBy(): unknown {
  return purryOrderRulesWithArgument(nthByImplementation, arguments);
}

const nthByImplementation = <T>(
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
