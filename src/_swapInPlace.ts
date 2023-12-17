export function swapInPlace(data: Array<unknown>, i: number, j: number): void {
  // We use destructuring to perform an in-place swap *without* needing a
  // temporary variable
  [data[i], data[j]] = [data[j], data[i]];
}
