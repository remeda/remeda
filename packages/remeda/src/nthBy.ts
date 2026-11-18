import {
  purryOrderRulesWithArgument,
  type OrderRules,
} from "./internal/purryOrderRules";
import { swapInPlace } from "./internal/swapInPlace";
import type { CompareFunction } from "./internal/types/CompareFunction";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules).at(index)` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param data - The input array.
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   nthBy(data, index, ...rules);
 * @example
 *   nthBy([2,1,4,5,3,], 2, identity()); // => 3
 * @dataFirst
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  data: T,
  index: number,
  ...rules: OrderRules<T[number]>
): T[number] | undefined;

/**
 * Retrieves the element that would be at the given index if the array were sorted according to specified rules. This function uses the *QuickSelect* algorithm running at an average complexity of *O(n)*. Semantically it is equivalent to `sortBy(data, ...rules)[index]` which would run at *O(nlogn)*.
 *
 * See also `firstBy` which provides an even more efficient algorithm and a stricter return type, but only for `index === 0`. See `takeFirstBy` to get all the elements up to and including `index`.
 *
 * @param index - The zero-based index for selecting the element in the sorted order. Negative indices count backwards from the end.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The element at the specified index in the sorted order, or `undefined` if the index is out of bounds.
 * @signature
 *   nthBy(index, ...rules)(data);
 * @example
 *   pipe([2,1,4,5,3,], nthBy(2, identity())); // => 3
 * @dataLast
 * @category Array
 */
export function nthBy<T extends IterableContainer>(
  index: number,
  ...rules: OrderRules<T[number]>
): (data: T) => T[number] | undefined;

export function nthBy(...args: readonly unknown[]): unknown {
  return purryOrderRulesWithArgument(nthByImplementation, args);
}

function nthByImplementation<T>(
  data: readonly T[],
  compareFn: CompareFunction<T>,
  index: number,
): T | undefined {
  // Negative indices count back from the end, like `Array.prototype.at`.
  const absoluteIndex = index >= 0 ? index : data.length + index;
  return absoluteIndex < 0 || absoluteIndex >= data.length
    ? // QuickSelect only works on indices within the array.
      undefined
    : quickSelect(
        // QuickSelect partitions the array in place, so it runs on a copy.
        data.concat(),
        0,
        data.length - 1,
        absoluteIndex,
        compareFn,
      );
}

/**
 * Finds the item that would be at `index` if `data` were sorted, by
 * partitioning only the range that contains it.
 *
 * @see https://en.wikipedia.org/wiki/Quickselect
 */
function quickSelect<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The algorithm partitions the array in place.
  data: T[],
  left: number,
  right: number,
  index: number,
  compareFn: CompareFunction<T>,
): T {
  if (left === right) {
    return data[left]!;
  }

  const pivotIndex = partition(data, left, right, compareFn);

  return index === pivotIndex
    ? // `partition` leaves the pivot at its sorted position, so if that is
      // `index`, the pivot is the item.
      data[index]!
    : quickSelect(
        data,
        // We continue by recursing into the partition where index would be
        index < pivotIndex ? left : pivotIndex + 1,
        index < pivotIndex ? pivotIndex - 1 : right,
        index,
        compareFn,
      );
}

function partition<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- The algorithm partitions the array in place.
  data: T[],
  left: number,
  right: number,
  compareFn: CompareFunction<T>,
): number {
  const pivot = data[right]!;

  let i = left;
  for (let j = left; j < right; j++) {
    if (!(compareFn(data[j]!, pivot) < 0)) {
      continue;
    }

    // Items that sort before the pivot go to the front of the range.
    swapInPlace(data, i, j);
    i += 1;
  }

  swapInPlace(data, i, right);

  // The location of the pivot by the end of the partition function.
  return i;
}
