import type { IterableContainer } from "./_types";
import type { IsLiteral } from "./type-fest/is-literal";

type IsStrictTuple<T extends IterableContainer> = T extends readonly []
  ? true
  : T extends readonly [unknown, ...infer Rest]
    ? IsStrictTuple<Rest>
    : false;

type NarrowableContainer<
  T,
  S extends IterableContainer<T>,
> = T extends S[number]
  ? // T is the narrowest we can get it, there's no additional value in passing it
    // through the type-predicate
    never
  : IsLiteral<T> extends false
    ? IsLiteral<S> extends true
      ? // T is wide enough and S is narrow enough that the narrowing won't impact
        // the negated type, avoiding our issue with the type-predicate (see the
        // tests)
        S
      : never
    : IsStrictTuple<S> extends true
      ? // When the container is too flexible we can't narrow the type because
        // we will also narrow the negated type too much.
        S
      : never;

/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). The input's type is narrowed to the container's type if
 * possible.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param data - The item that is checked.
 * @param container - The items that are checked against.
 * @returns A narrowed version of the input data on success, `false` otherwise.
 * @signature
 *   R.isIncludedIn(data, container);
 * @example
 *   R.isIncludedIn(2, [1, 2, 3]); // => true
 *   R.isIncludedIn(4, [1, 2, 3]); // => false
 *
 *   const data = "cat" as "cat" | "dog" | "mouse";
 *   R.isIncludedIn(data, ["cat", "dog"] as const); // true (typed "cat" | "dog");
 * @dataFirst
 * @category Guard
 */
export function isIncludedIn<T, S extends IterableContainer<T>>(
  data: T,
  container: NarrowableContainer<T, S>,
): data is S[number];
export function isIncludedIn<T, S extends T>(
  data: T,
  container: IterableContainer<S>,
): boolean;

/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). The input's type is narrowed to the container's type if
 * possible.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param container - The items that are checked against.
 * @returns A narrowed version of the input data on success, `false` otherwise.
 * @signature
 *   R.isIncludedIn(container)(data);
 * @example
 *   R.pipe(2, R.isIncludedIn([1, 2, 3])); // => true
 *   R.pipe(4, R.isIncludedIn([1, 2, 3])); // => false
 *
 *   const data = "cat" as "cat" | "dog" | "mouse";
 *   R.pipe(
 *     data,
 *     R.isIncludedIn(["cat", "dog"] as const),
 *   ); // => true (typed "cat" | "dog");
 * @dataLast
 * @category Guard
 */
export function isIncludedIn<T, S extends IterableContainer<T>>(
  container: NarrowableContainer<T, S>,
): (data: T) => data is S[number];
export function isIncludedIn<T, S extends T>(
  container: IterableContainer<S>,
): (data: T) => boolean;

export function isIncludedIn(
  dataOrContainer: unknown,
  container?: ReadonlyArray<unknown>,
): unknown {
  if (container === undefined) {
    // === dataLast ===
    // We don't use purry here because we can optimize the dataLast case by
    // memoizing a set and accessing it in O(1) time instead of scanning the
    // array **each time** (O(n)) each time.
    const asSet = new Set(dataOrContainer as ReadonlyArray<unknown>);
    return (data: unknown) => asSet.has(data);
  }

  // === dataFirst ===
  return container.indexOf(dataOrContainer) >= 0;
}
