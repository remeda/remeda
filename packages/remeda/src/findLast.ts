import type { LastArrayElement } from "type-fest";
import type { ItemMatch } from "./internal/types/ItemMatch";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { Narrowed } from "./internal/types/Narrowed";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type FoundLast<T extends IterableContainer, Condition> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? FoundLastInFixedTuple<
        TupleParts<T>["suffix"],
        Condition,
        // When the suffix part doesn't have any item that would always match
        // we fall back to the optional parts of the tuple which might match,
        // but might also just not exist.
        | Narrowed<TupleParts<T>["item"], Condition>
        | Narrowed<TupleParts<T>["optional"][number], Condition>
        // The required part is always present, but it precedes every other
        // part of the tuple, so any match in it is only the last one when the
        // parts after it have none; this makes it the fallback of them all.
        | FoundLastInFixedTuple<
            TupleParts<T>["required"],
            Condition,
            // When an item isn't found we need to return `undefined`, but
            // because it might still always exist in the required part we set
            // this return value as the fallback of the required part, this way
            // if the required part has a match the fallback isn't reached and
            // we don't add the `undefined`, and in any other case the fallback
            // would make sure we cover this case too.
            undefined
          >
      >
    : never;

// This type only works under the assumption that T is a simple fixed tuple (no
// optional items and no rest items)!
type FoundLastInFixedTuple<T, Condition, Fallback> = T extends readonly [
  ...infer Rest,
  infer Last,
]
  ? ItemMatch<Last, Condition> extends "always"
    ? // We found a definite match that is always correct!
      Last
    : | (ItemMatch<Last, Condition> extends "never"
          ? // We found a definite non-match, we skip it.
            never
          : // We found a non-definite match, it might match, and it might not,
            // so we fork the type on it.
            Narrowed<Last, Condition>)
      // Regardless, we continue searching for other matches too...
      | FoundLastInFixedTuple<Rest, Condition, Fallback>
  : // T must be exactly `[]` here, so the match must come from the fallback.
    Fallback;

// For non-type-narrowing predicates, we can only provide more refined type when
// we know the predicate returns a constant literal boolean value.
type FoundLastNonRefined<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
> = boolean extends IsItemIncluded
  ? T[number] | undefined
  : IsItemIncluded extends true
    ? // `findLast(data, constant(true))` is equivalent to `last(data)`.
      LastArrayElement<T>
    : undefined;

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    findLast(data, predicate)
 * @example
 *    findLast([1, 3, 4, 6], n => n % 2 === 1) // => 3
 * @dataFirst
 * @category Array
 */
export function findLast<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): FoundLast<T, Condition>;

export function findLast<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): FoundLastNonRefined<T, IsItemIncluded>;

/**
 * Iterates the array in reverse order and returns the value of the first
 * element that satisfies the provided testing function. If no elements satisfy
 * the testing function, undefined is returned.
 *
 * Similar functions:
 * * `find` - If you need the first element that satisfies the provided testing function.
 * * `findLastIndex` - If you need the index of the found element in the array.
 * * `lastIndexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The last (highest-index) element in the array that satisfies the
 * provided testing function; undefined if no matching element is found.
 * @signature
 *    findLast(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      findLast(n => n % 2 === 1)
 *    ) // => 3
 * @dataLast
 * @category Array
 */
export function findLast<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => FoundLast<T, Condition>;

export function findLast<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => FoundLastNonRefined<T, IsItemIncluded>;

export function findLast(...args: readonly unknown[]): unknown {
  return purry(findLastImplementation, args);
}

const findLastImplementation = <T, S extends T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => value is S,
): S | undefined => {
  // TODO [>2]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.findLast` here.

  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i]!;
    if (predicate(item, i, data)) {
      return item;
    }
  }

  return undefined;
};
