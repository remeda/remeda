import { purry } from './purry';
import { sortedIndexWithImplementation } from './sortedIndexWith';

export function sortedLastIndexBy<T>(
  data: ReadonlyArray<T>,
  item: T,
  valueFunction: (item: T) => NonNullable<unknown>
): number;
export function sortedLastIndexBy<T>(
  item: T,
  valueFunction: (item: T) => NonNullable<unknown>
): (data: ReadonlyArray<T>) => number;
export function sortedLastIndexBy(): unknown {
  return purry(sortedLastIndexByImplementation, arguments);
}

function sortedLastIndexByImplementation<T>(
  array: ReadonlyArray<T>,
  item: T,
  valueFunction: (item: T) => NonNullable<unknown>
): number {
  const value = valueFunction(item);
  return sortedIndexWithImplementation(
    array,
    otherItem => value <= valueFunction(otherItem)
  );
}
