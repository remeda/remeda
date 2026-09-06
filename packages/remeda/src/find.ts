import { toSingle } from "./internal/toSingle";
import type { Assignability } from "./internal/types/Assignability";
import type { First } from "./internal/types/First";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import type { Narrowed } from "./internal/types/Narrowed";
import type { TupleParts } from "./internal/types/TupleParts";
import { SKIP_ITEM } from "./internal/utilityEvaluators";
import { purry } from "./purry";

type Found<T extends IterableContainer, Condition> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? FoundInFixedTuple<
        TupleParts<T>["required"],
        Condition,
        // When the required part doesn't have any item that would always match
        // we fall back to the optional parts of the tuple which might match.
        | Narrowed<TupleParts<T>["optional"][number], Condition>
        | Narrowed<TupleParts<T>["item"], Condition>
        // A non-trivial suffix part can only show up if a non-trivial optional
        // part or a non-trivial item exists, so it is always part of the
        // fallback of the required part.
        | FoundInFixedTuple<
            TupleParts<T>["suffix"],
            Condition,
            // When an item isn't found we need to return `undefined`, but
            // because it might still always exist in the suffix we set this
            // return value as the fallback of the suffix part, this way if the
            // suffix has a match the fallback isn't reached and we don't add
            // the `undefined`, and in any other case the fallback would make
            // sure we cover this case too.
            undefined
          >
      >
    : never;

// This type only works under the assumption that T is a simple fixed tuple (no
// optional items and no rest items)!
type FoundInFixedTuple<T, Condition, Fallback> = T extends readonly [
  infer Head,
  ...infer Rest,
]
  ? Assignability<
      Head,
      Condition,
      {
        full: Head;

        // Because the match isn't full we need to also consider the rest of the
        // items too because in runtime we might skip the current item.
        partial:
          | Narrowed<Head, Condition>
          | FoundInFixedTuple<Rest, Condition, Fallback>;
        none: FoundInFixedTuple<Rest, Condition, Fallback>;
      }
    >
  : Fallback;

// For non-type-narrowing predicates, we can only provide more refined type when
// we know the predicate returns a constant literal boolean value.
type FoundNonRefined<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
> = boolean extends IsItemIncluded
  ? T[number] | undefined
  : IsItemIncluded extends true
    ? // `find(data, constant(true))` is equivalent to `first(data)`.
      First<T>
    : undefined;

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param data - The items to search in.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    find(data, predicate)
 * @example
 *    find([1, 3, 4, 6], n => n % 2 === 0) // => 4
 * @dataFirst
 * @lazy
 * @category Array
 */
export function find<T extends IterableContainer, Condition>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): Found<T, Condition>;

export function find<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  data: T,
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): FoundNonRefined<T, IsItemIncluded>;

/**
 * Returns the first element in the provided array that satisfies the provided
 * testing function. If no values satisfy the testing function, `undefined` is
 * returned.
 *
 * Similar functions:
 * * `findLast` - If you need the last element that satisfies the provided testing function.
 * * `findIndex` - If you need the index of the found element in the array.
 * * `indexOf` - If you need to find the index of a value.
 * * `includes` - If you need to find if a value exists in an array.
 * * `some` - If you need to find if any element satisfies the provided testing function.
 * * `filter` - If you need to find all elements that satisfy the provided testing function.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to indicate a matching element has been found, and
 * `false` otherwise. A type-predicate can also be used to narrow the result.
 * @returns The first element in the array that satisfies the provided testing
 * function. Otherwise, `undefined` is returned.
 * @signature
 *    find(predicate)(data)
 * @example
 *    pipe(
 *      [1, 3, 4, 6],
 *      find(n => n % 2 === 0)
 *    ) // => 4
 * @dataLast
 * @lazy
 * @category Array
 */
export function find<T extends IterableContainer, Condition>(
  predicate: (value: T[number], index: number, data: T) => value is Condition,
): (data: T) => Found<T, Condition>;

export function find<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
>(
  predicate: (value: T[number], index: number, data: T) => IsItemIncluded,
): (data: T) => FoundNonRefined<T, IsItemIncluded>;

export function find(...args: readonly unknown[]): unknown {
  return purry(findImplementation, args, toSingle(lazyImplementation));
}

const findImplementation = <T, S extends T>(
  data: readonly T[],
  predicate: (value: T, index: number, data: readonly T[]) => value is S,
): S | undefined => data.find(predicate);

const lazyImplementation =
  <T, S extends T>(
    predicate: (value: T, index: number, data: readonly T[]) => value is S,
  ): LazyEvaluator<T, S> =>
  (value, index, data) =>
    predicate(value, index, data)
      ? { done: true, hasNext: true, next: value }
      : SKIP_ITEM;
