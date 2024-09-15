import type { IsInteger, IsNegative, Subtract } from "type-fest";
import type {
  CoercedArray,
  IterableContainer,
  NTuple,
  TupleParts,
} from "./internal/types";
import { SKIP_ITEM, lazyIdentityEvaluator } from "./internal/utilityEvaluators";
import type { LazyEvaluator } from "./pipe";
import { purry } from "./purry";

type Drop<T extends IterableContainer, N extends number> =
  IsNegative<N> extends true
    ? // Negative numbers result in nothing being dropped.
      T
    : IsInteger<N> extends false
      ? // We can't compute accurate types for non-integer numbers so we
        // fallback to the "legacy" typing where we convert our output to a
        // simple array. This is also the case when N is not a literal value
        // (e.g. it is `number`).
        // TODO: We can improve this type by returning a union of all possible
        // dropped shapes (e.g. the equivalent of Drop<T, 1> | Drop<T, 2> |
        // Drop<T, 3> | ...).
        Array<T[number]>
      : // We have an non-negative integer N so we start chopping up the array.
        // first we take a look at its prefix:
        TupleParts<T>["prefix"] extends [
            ...NTuple<unknown, N>,
            ...infer Remaining,
          ]
        ? // If the prefix is as long as N, we know the drop would only remove
          // items from the prefix, so we reconstruct the array with any
          // remaining items from the prefix, and the rest of the array as it
          // is...
          [
            ...Remaining,
            ...CoercedArray<TupleParts<T>["item"]>,
            ...TupleParts<T>["suffix"],
          ]
        : // But if the prefix is shorter than N, the drop would also remove
          // items from the rest param and possibly the suffix.
          0 extends TupleParts<T>["suffix"]["length"]
          ? // When there is no suffix the result is simply the rest param, and
            // dropping items from a simple array results in the same array
            // type.
            CoercedArray<TupleParts<T>["item"]>
          : // But if we have a suffix, the drop could remove items from it.
            | DropUpTo<
                  TupleParts<T>["suffix"],
                  // If the suffix has any items dropped, it would be after all
                  // prefix items have been removed, so we need to take those
                  // into account when counting how many items to drop from the
                  // suffix.
                  Subtract<N, TupleParts<T>["prefix"]["length"]>
                >
              // And because we have a rest component, we also need to
              // consider that all items were removed from that part, leaving
              // the suffix intact.
              | [...Array<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]];

/**
 * Arrays with a fixed suffix will result in any number of items being dropped,
 * up to N, and not just N itself. This is because we don't know during typing
 * how many items the "rest" part of the tuple will have in runtime.
 *
 * !Important: This is an internal type and assumes that T is a fixed-size
 * tuple! It will not work if T has a rest element.
 */
type DropUpTo<
  T,
  N,
  Dropped extends ReadonlyArray<unknown> = [],
> = Dropped["length"] extends N
  ? // The last item had been dropped off T
    T
  : T extends [unknown, ...infer Rest]
    ? // Take the current value, and then recurse with the array where it is
      // dropped, while counting how many items we've already dropped.
      DropUpTo<Rest, N, [...Dropped, unknown]> | T
    : // T is most likely [] at this point, but we use T instead of [] just to
      // be on the safe side.
      T;

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
