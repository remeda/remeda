import { purryOrderRules, type OrderRule } from './_purryOrderRules';
import type { IterableContainer, NonEmptyArray } from './_types';
import { hasAtLeast } from './hasAtLeast';

type FirstBy<T extends IterableContainer> =
  | T[number]
  | (T extends readonly [unknown, ...ReadonlyArray<unknown>]
      ? never
      : T extends readonly [...ReadonlyArray<unknown>, unknown]
        ? never
        : undefined);

export function firstBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): FirstBy<T>;

export function firstBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => FirstBy<T>;

export function firstBy(): unknown {
  return purryOrderRules(firstByImplementation, arguments);
}

function firstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: (a: T, b: T) => number
): T | undefined {
  let [currentFirst] = data;

  if (!hasAtLeast(data, 2)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return currentFirst;
  }

  // Remove the first item, we won't compare it with itself.
  const [, ...rest] = data;
  for (const item of rest) {
    if (compareFn(currentFirst, item) > 0) {
      currentFirst = item;
    }
  }

  return currentFirst;
}
