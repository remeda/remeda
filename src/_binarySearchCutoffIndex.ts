export function _binarySearchCutoffIndex<T>(
  array: ReadonlyArray<T>,
  predicate: (item: T, index: number) => boolean,
): number {
  // !IMPORTANT: This docblock is not above the function because then the code that builds our docs site breaks. Please do not move it.
  /**
   * A binary search implementation that finds the index at which `predicate`
   * stops returning `true` and starts returning `false` (consistently) when run
   * on the items of the array. It **assumes** that mapping the array via the
   * predicate results in the shape `[...true[], ...false[]]`. *For any other case
   * the result is unpredictable.*
   *
   * This is the base implementation of the `sortedIndex` functions which define
   * the predicate for the user, for common use-cases.
   *
   * It is similar to `findIndex`, but runs at O(logN), whereas the latter is
   * general purpose function which runs on any array and predicate, but runs at
   * O(N) time.
   */

  let lowIndex = 0;
  let highIndex = array.length;

  while (lowIndex < highIndex) {
    // We use bitwise operator here as a way to find the mid-point and round it
    // down using the same operation.
    const pivotIndex = (lowIndex + highIndex) >>> 1;
    const pivot = array[pivotIndex]!;

    if (predicate(pivot, pivotIndex)) {
      lowIndex = pivotIndex + 1;
    } else {
      highIndex = pivotIndex;
    }
  }

  return highIndex;
}
