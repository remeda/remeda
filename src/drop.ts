import { type IfNever, type Subtract } from "type-fest";
import {
  type IterableContainer,
  type NTuple,
  type TupleParts,
} from "./internal/types";
import { SKIP_ITEM, lazyIdentityEvaluator } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Drop<T extends IterableContainer, N extends number> = number extends N
  ? Array<T[number]>
  : `${N}` extends `-${number}`
    ? T
    : TupleParts<T>["prefix"] extends [
          ...NTuple<unknown, N>,
          ...infer Remaining,
        ]
      ? [
          ...Remaining,
          ...IfNever<TupleParts<T>["item"], [], Array<TupleParts<T>["item"]>>,
          ...TupleParts<T>["suffix"],
        ]
      : IfNever<
          TupleParts<T>["item"],
          [],
          0 extends TupleParts<T>["suffix"]["length"]
            ? Array<TupleParts<T>["item"]>
            :
                | DropUpTo<
                    TupleParts<T>["suffix"],
                    Subtract<N, TupleParts<T>["prefix"]["length"]>
                  >
                | [...Array<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]
        >;

type DropUpTo<
  T,
  N,
  Dropped extends ReadonlyArray<unknown> = [],
> = Dropped["length"] extends N
  ? T
  : T extends [unknown, ...infer Rest]
    ? DropUpTo<Rest, N, [...Dropped, unknown]> | T
    : T;

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
): <T extends IterableContainer>(array: T) => Drop<T, N>;

export function drop(...args: ReadonlyArray<unknown>): unknown {
  return purry(dropImplementation, args, lazyImplementation);
}

const dropImplementation = <T extends IterableContainer>(
  array: T,
  n: number,
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
