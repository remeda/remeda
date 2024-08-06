import type { IfNever } from "type-fest";
import { SKIP_ITEM, lazyIdentityEvaluator } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";
import {
  type NTuple,
  type TupleParts,
  type IterableContainer,
} from "./internal/types";

type Drop<T extends IterableContainer, N extends number> = number extends N
  ? Array<T[number]>
  : `${N}` extends `-${number}`
    ? T
    : [
        ...(TupleParts<T>["prefix"] extends [...NTuple<unknown, N>, ...infer V]
          ? V
          : []),
        ...IfNever<
          TupleParts<T>["item"],
          [],
          Array<TupleParts<T>["item"] | TupleParts<T>["suffix"][number]>
        >,
      ];

/**
 * Removes first `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(array, n)
 * @example
 *    R.drop([1, 2, 3, 4, 5], 2) // => [3, 4, 5]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function drop<T extends IterableContainer, N extends number>(
  array: T,
  n: N,
): Drop<T, N>;

/**
 * Removes first `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.drop(n)(array)
 * @example
 *    R.drop(2)([1, 2, 3, 4, 5]) // => [3, 4, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
export function drop<N extends number>(
  n: N,
): <T extends IterableContainer>(data: T) => Drop<T, N>;

export function drop(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropImplementation, args, lazyImplementation);
}

const dropImplementation = <T extends IterableContainer, N extends number>(
  array: T,
  n: N,
): Array<T[number]> => (n < 0 ? [...array] : array.slice(n));

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (n <= 0) {
    return lazyIdentityEvaluator;
  }

  let left = n;
  return (value) => {
    if (left > 0) {
      left -= 1;
      return SKIP_ITEM;
    }
    return { done: false, hasNext: true, next: value };
  };
}
