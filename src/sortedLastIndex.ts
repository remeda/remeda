import { purry } from './purry';
import { sortedIndexWithImplementation } from './sortedIndexWith';

export function sortedLastIndex<T>(data: ReadonlyArray<T>, item: T): number;
export function sortedLastIndex<T>(item: T): (data: ReadonlyArray<T>) => number;
export function sortedLastIndex(): unknown {
  return purry(sortedLastIndexImplementation, arguments);
}

const sortedLastIndexImplementation = <T>(
  array: ReadonlyArray<T>,
  item: T
): number =>
  sortedIndexWithImplementation(array, otherItem => item <= otherItem);
