import { purry } from './purry';

export function sortedIndexWith<T>(
  data: ReadonlyArray<T>,
  comparator: (item: T) => boolean
): number;
export function sortedIndexWith<T>(
  comparator: (item: T) => boolean
): (data: ReadonlyArray<T>) => number;
export function sortedIndexWith(): unknown {
  return purry(sortedIndexWithImplementation, arguments);
}

export function sortedIndexWithImplementation<T>(
  array: ReadonlyArray<T>,
  comparator: (item: T) => boolean
): number {
  let lowIndex = 0;
  let highIndex = array.length;

  while (lowIndex < highIndex) {
    // We use bitwise operator here as a way to find the mid-point and round it
    // down using the same operation.
    const pivotIndex = (lowIndex + highIndex) >>> 1;
    const pivot = array[pivotIndex];

    if (comparator(pivot)) {
      lowIndex = pivotIndex + 1;
    } else {
      highIndex = pivotIndex;
    }
  }

  return highIndex;
}
