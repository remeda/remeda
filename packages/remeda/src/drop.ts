import type { IsInteger, IsNegative, Writable } from "type-fest";
import type { ClampedIntegerSubtract } from "./internal/types/ClampedIntegerSubtract";
import type { CoercedArray } from "./internal/types/CoercedArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { PartialArray } from "./internal/types/PartialArray";
import type { TupleParts } from "./internal/types/TupleParts";
import { SKIP_ITEM, lazyIdentityEvaluator } from "./internal/utilityEvaluators";
import { purry } from "./purry";

type Drop<T extends IterableContainer, N extends number> =
  IsNegative<N> extends true
    ? // Negative numbers result in nothing being dropped, we return a shallow
      // clone of the array.
      Writable<T>
    : IsInteger<N> extends false
      ? // We can't compute accurate types for non-integer numbers so we
        // fallback to the "legacy" typing where we convert our output to a
        // simple array. This is also the case when N is not a literal value
        // (e.g. it is `number`).
        // TODO: We can improve this type by returning a union of all possible dropped shapes (e.g. the equivalent of Drop<T, 1> | Drop<T, 2> | Drop<T, 3> | ...).
        Array<T[number]>
      : ClampedIntegerSubtract<
            N,
            TupleParts<T>["required"]["length"]
          > extends infer RemainingPrefix extends number
        ? RemainingPrefix extends 0
          ? // The drop will occur within the required part of the tuple, we
            // simply remove those elements from it and reconstruct the rest of
            // the tuple.
            [
              ...DropFixedTuple<TupleParts<T>["required"], N>,
              ...PartialArray<TupleParts<T>["optional"]>,
              ...CoercedArray<TupleParts<T>["item"]>,
              ...TupleParts<T>["suffix"],
            ]
          : ClampedIntegerSubtract<
                RemainingPrefix,
                TupleParts<T>["optional"]["length"]
              > extends infer RemainingOptional extends number
            ? RemainingOptional extends 0
              ? // The drop will occur within the optional part of the tuple, we
                // completely remove the required part, remove enough elements
                // from the optional part, and reconstruct the rest of the
                // tuple.
                [
                  ...PartialArray<
                    DropFixedTuple<TupleParts<T>["optional"], RemainingPrefix>
                  >,
                  ...CoercedArray<TupleParts<T>["item"]>,
                  ...TupleParts<T>["suffix"],
                ]
              : // The drop will occur within the rest element or the suffix.
                // Because the suffix can contain any number of elements this
                // case adds more complexity as we need to consider all possible
                // (relevant) lengths. We start by considering the case where
                // there are enough elements within the rest param; this means
                // we still maintain the rest element as it could contain even
                // more elements, and we add the suffix untouched.
                | [
                      ...CoercedArray<TupleParts<T>["item"]>,
                      ...TupleParts<T>["suffix"],
                    ]
                  // Additionally, we need to consider the case where the rest
                  // element has up to the same number of elements as the
                  // suffix; this will result in removing the rest element
                  // entirely, and dropping elements from the suffix. We do this
                  // for all possible values from 0 to N where N is the
                  // remaining value after we handled the prefix. We can exclude
                  // the 0 case because it is contained in the previous case.
                  | Exclude<
                      DropFixedTuple<
                        TupleParts<T>["suffix"],
                        RemainingOptional,
                        true /* IncludePrefixes */
                      >,
                      TupleParts<T>["suffix"]
                    >
            : never
        : never;

type DropFixedTuple<
  T,
  N,
  // This flag controls if we want a union of all possible prefixes, or just the
  // final tuple with all N items dropped.
  IncludePrefixes = false,
  Dropped extends Array<unknown> = [],
> = Dropped["length"] extends N
  ? T
  : T extends readonly [unknown, ...infer Rest]
    ?
        | DropFixedTuple<Rest, N, IncludePrefixes, [...Dropped, unknown]>
        | (true extends IncludePrefixes ? T : never)
    : [];

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
