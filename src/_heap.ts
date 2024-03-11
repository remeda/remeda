/**
 * Heap related utilities.
 */

import { swapInPlace } from "./_swapInPlace";
import type { CompareFunction } from "./_types";
import { hasAtLeast } from "./hasAtLeast";

/**
 * Mutates an array into a "max"-heap based on `compareFn` so that for any `item` in the heap, `compareFn(heap[0], item) > 0`.
 *
 * @param heap - The array to be heapified. The array would be mutated!
 * @param compareFn - The comparator used to order items in the heap. Use the
 * same function in all calls mutating the same heap otherwise you'd get
 * unexpected results.
 */
export function heapify<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional!
  heap: Array<T>,
  compareFn: CompareFunction<T>,
): void {
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    heapSiftDown(heap, i, compareFn);
  }
}

/**
 * Insert an item into a heap if it's "smaller" (in regards to `compareFn`) than
 * the current head of the heap (which is the "largest" value in the heap). If
 * the item is inserted, the previous head of the heap is returned, otherwise
 * `undefined` is returned and the heap is unchanged.
 *
 * @param heap - A *mutable* array representing a heap (see `heapify`).
 * @param compareFn - The comparator used to order items in the heap. Use the.
 * @param item - The item to be inserted into the heap.
 * @returns `undefined` if the heap is unchanged, or the previous head of the
 * heap if the item was inserted.
 */
export function heapMaybeInsert<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional!
  heap: Array<T>,
  compareFn: CompareFunction<T>,
  item: T,
): T | undefined {
  if (!hasAtLeast(heap, 1)) {
    return;
  }

  const [head] = heap;

  if (compareFn(item, head) >= 0) {
    // The item shouldn't be inserted into the heap, the heap is unchanged.
    return;
  }

  heap[0] = item;
  heapSiftDown(heap, 0, compareFn);
  return head;
}

/**
 * The main heap operation. Takes a `heap` and an `index` and sifts the item
 * down the heap until it reaches the correct position based on `compareFn`,
 * swapping other items in the process.
 */
function heapSiftDown<T>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional!
  heap: Array<T>,
  index: number,
  compareFn: CompareFunction<T>,
): void {
  let currentIndex = index;

  // The loop continues while the currentIndex has children in the heap.
  while (currentIndex * 2 + 1 < heap.length) {
    const firstChildIndex = currentIndex * 2 + 1;

    let swapIndex =
      compareFn(heap[currentIndex]!, heap[firstChildIndex]!) < 0
        ? // Is the parent "smaller" (in regards to `compareFn`) to its child?
          firstChildIndex
        : currentIndex;

    const secondChildIndex = firstChildIndex + 1;
    if (
      secondChildIndex < heap.length &&
      compareFn(heap[swapIndex]!, heap[secondChildIndex]!) < 0
    ) {
      // Is there a second child? Is it the smallest of the three?
      swapIndex = secondChildIndex;
    }

    if (swapIndex === currentIndex) {
      // We assume the array is a heap and the existing order of items satisfies
      // the compareFn so we can stop here.
      return;
    }

    swapInPlace(heap, currentIndex, swapIndex);

    currentIndex = swapIndex;
  }
}
