/**
 * A simple implementation of the *QuickSelect* algorithm.
 * @see https://en.wikipedia.org/wiki/Quickselect
 */

import { swapInPlace } from "./_swapInPlace";
import type { CompareFunction } from "./_types";

/**
 * Perform QuickSelect on the given data. Notice that the data would be cloned
 * shallowly so that it could be mutated in-place, and then discarded once the
 * algorithm is done. This means that running this function multiple times on
 * the same array might be slower then sorting the array before.
 * @param data - The data to perform the selection on.
 * @param index - The index of the item we are looking for.
 * @param compareFn - The compare function to use for sorting.
 * @returns The item at the given index, or `undefined` if the index is out-of-
 * bounds.
 */
export const quickSelect = <T>(
  data: ReadonlyArray<T>,
  index: number,
  compareFn: CompareFunction<T>,
): T | undefined =>
  index < 0 || index >= data.length
    ? // Quickselect doesn't work with out-of-bound indices
      undefined
    : quickSelectImplementation(
        // We need to clone the array because quickSelect mutates it in-place.
        [...data],
        0 /* left */,
        data.length - 1 /* right */,
        index,
        compareFn,
      );

/**
 * The actual implementation, called recursively.
 */
function quickSelectImplementation<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional!
  data: Array<T>,
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
    ? // Once a pivot is chosen it's location is final, so if it matches the
      // index we found out item!
      data[index]!
    : quickSelectImplementation(
        data,
        // We continue by recursing into the partition where index would be
        index < pivotIndex ? left : pivotIndex + 1,
        index < pivotIndex ? pivotIndex - 1 : right,
        index,
        compareFn,
      );
}

function partition<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional!
  data: Array<T>,
  left: number,
  right: number,
  compareFn: CompareFunction<T>,
): number {
  const pivot = data[right]!;

  let i = left;
  for (let j = left; j < right; j++) {
    if (compareFn(data[j]!, pivot) < 0) {
      // Move items smaller then the pivot to the start of the array.
      swapInPlace(data, i, j);
      i += 1;
    }
  }

  swapInPlace(data, i, right);

  // The location of the pivot by the end of the partition function.
  return i;
}
