/**
 * Heap related utilities.
 */

/**
 * Turn an array into a **MAX**-heap using `compareFn`
 */
export function heapify<T>(heap: Array<T>, compareFn: (a: T, b: T) => number) {
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    heapSiftDown(heap, i, compareFn);
  }
}

/**
 * The main heap operation. Notice that enforces a **MAX**-heap, the head of the
 * heap would contain the largest element based on compareFn.
 */
export function heapSiftDown<T>(
  heap: Array<T>,
  start: number,
  compareFn: (a: T, b: T) => number
): void {
  let root = start;

  while (root * 2 + 1 <= heap.length - 1) {
    const child = root * 2 + 1;
    let swap = root;

    if (compareFn(heap[swap], heap[child]) < 0) {
      swap = child;
    }
    if (
      child + 1 <= heap.length - 1 &&
      compareFn(heap[swap], heap[child + 1]) < 0
    ) {
      swap = child + 1;
    }
    if (swap === root) {
      return;
    } else {
      [heap[root], heap[swap]] = [heap[swap], heap[root]];
      root = swap;
    }
  }
}
