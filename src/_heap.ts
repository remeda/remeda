/**
 * Heap related utilities.
 */

import { swapInPlace } from './_swapInPlace';

// The comparator used in the heapify algorithm to order items in the heap.
type HeapComparator<T> = (a: T, b: T) => number;

/**
 * Mutates an array into a "max"-heap based on `compareFn` so that for any `item` in the heap, `compareFn(heap[0], item) > 0`
 *
 * @param heap - The array to be heapified. The array would be mutated!
 * @param compareFn - The comparator used to order items in the heap. Use the
 * same function in all calls mutating the same heap otherwise you'd get
 * unexpected results.
 * @returns - void, the result is in the provided heap array.
 */
export function heapify<T>(heap: Array<T>, compareFn: HeapComparator<T>): void {
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    heapSiftDown(heap, i, compareFn);
  }
}

/**
 * The main heap operation. Takes a `heap` and an `index` and sifts the item
 * down the heap until it reaches the correct position based on `compareFn`,
 * swapping other items in the process.
 */
export function heapSiftDown<T>(
  heap: Array<T>,
  index: number,
  compareFn: HeapComparator<T>
): void {
  let currentIndex = index;

  // The loop continues while the currentIndex has children in the heap.
  while (currentIndex * 2 + 1 < heap.length) {
    const firstChildIndex = currentIndex * 2 + 1;

    let swapIndex =
      compareFn(heap[currentIndex], heap[firstChildIndex]) < 0
        ? // Is the parent "smaller" (in regards to `compareFn`) to its child?
          firstChildIndex
        : currentIndex;

    const secondChildIndex = firstChildIndex + 1;
    if (
      secondChildIndex < heap.length &&
      compareFn(heap[swapIndex], heap[secondChildIndex]) < 0
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
