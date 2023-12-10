import { purryOrderRules, type OrderRule } from './_purryOrderRules';
import type { IterableContainer, NonEmptyArray } from './_types';
import { hasAtLeast } from './hasAtLeast';

export function firstIndexBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): number;

export function firstIndexBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => number;

export function firstIndexBy(): unknown {
  return purryOrderRules(firstIndexByImplementation, arguments);
}

function firstIndexByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: (a: T, b: T) => number
): number {
  if (!hasAtLeast(data, 1)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return -1;
  }

  let currentIndex = 0;

  for (let i = 1; i < data.length; i++) {
    if (compareFn(data[currentIndex], data[i]) > 0) {
      currentIndex = i;
    }
  }

  return currentIndex;
}
