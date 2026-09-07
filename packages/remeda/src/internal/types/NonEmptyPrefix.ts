import type { IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

/**
 * Helper type for lazy data-last callbacks.
 *
 * @see NonEmptyPrefix
 */
export type LazyCallback<T extends IterableContainer, R> = (
  item: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => R;

/**
 * Helper type for lazy data-last type predicates (because TypeScript doesn't
 * support the syntax `LazyCallback<T, is S>`).
 *
 * @see NonEmptyPrefix
 */
export type LazyTypePredicate<T extends IterableContainer, S> = (
  item: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => item is S;

/**
 * For utilities that support lazy evaluation (like `map`, `filter`, etc...)
 * `pipe` computes the 3rd callback parameter (which is usually the same
 * reference as the input array in the standard library) lazily too, item by
 * item, as the items flow through the pipe. This means that unlike the standard
 * library, we can't type the parameter as the plain input array T, instead, we
 * need to compute a shape that represents a partial prefix of the input T, and
 * we want to maintain as much of the input shape as possible. This will prevent
 * unchecked array access for items which haven't been computed and added to the
 * array yet.
 *
 * Additionally, because the callback is always called when at least the first
 * item is already being processed we can further refine our type so that it has
 * a required first item (e.g., the array is not empty), similar to calling
 * `hasAtLeast(1)` on the shape we computed.
 *
 * Use this type for any callback that `pipe` invokes lazily. That is always
 * the data-last overload, and for utilities built on `purryFromLazy` (which
 * routes data-first calls through `pipe` as well) it is the data-first overload
 * too. This is a low-level type, prefer `LazyCallback` and
 * `LazyTypePredicate` over direct usage.
 *
 * When the type is used for a callback used in `pipe` it should be wrapped in
 * `Readonly` to prevent the callback from mutating it, as it is owned by `pipe`
 * and can corrupt future iterations.
 *
 * @example
 *   // data-first (eager, via `purry`)
 *   function forEach<T extends IterableContainer>(
 *     data: T,
 *     callbackfn: (value: T[number], index: number, data: T) => void,
 *   ): void;
 *
 *   // data-last (lazy, via `pipe`)
 *   function forEach<T extends IterableContainer>(
 *     callbackfn: LazyCallback<T, void>,
 *   ): (data: T) => void;
 */
export type NonEmptyPrefix<T extends IterableContainer> =
  // Distribute over unions so that each member is decomposed on its own.
  T extends unknown
    ? | HeadPrefixes<
          [...TupleParts<T>["required"], ...TupleParts<T>["optional"]],
          TupleParts<T>["item"]
        >
      | SuffixPrefixes<
          TupleParts<T>["required"],
          TupleParts<T>["item"],
          TupleParts<T>["suffix"]
        >
    : never;

// For most tuple shapes (see the suffix cases below) the reconstructed type is
// dependent on the presence of a prefix (either required and/or optional) and
// the rest item.
type HeadPrefixes<Prefix, Item> = Prefix extends readonly []
  ? IsNever<Item> extends true
    ? // Only empty tuple types have neither a prefix or a rest item, they also
      // don't have any prefixes!
      never
    : // Without a prefix part the prefix is just a simple non-empty array
      // shape.
      [Item, ...Item[]]
  : // When we have a non-trivial prefix then it has a first item, and all
    // remaining items are optional by definition. We add the rest item if it
    // exists.
    [...PartialTail<Prefix>, ...CoercedArray<Item>];

// Non-trivial suffixes can only show up in two tuple shapes, fixed-suffix
// arrays, and fixed-elements arrays (see the definitions in the `TupleParts`
// docs). Both contain no optional part, contain a non-trivial rest item, and
// are differentiated by the presence of a required prefix, or lack thereof.
// TypeScript doesn't support optional elements after the rest element, so we
// can't just rewrite the suffix and add it to the end of the tuple to support
// the lazily reconstructed prefixes, instead, we need to consider each prefix
// of the suffix as it's own type and add them in a union. For **any** other
// tuple shape this type resolves to `never` (via the TypeScript mechanism that
// reduces `[...never]` to `never`).
type SuffixPrefixes<
  Required extends unknown[],
  Item,
  Suffix,
> = Required extends readonly []
  ? // For fixed-suffix arrays we have 2 situations we need to handle, the first
    // handles the rest item, taking the first iteration of it as required and
    // constructing the rest of the tuple after it.
    | [Item, ...Item[], ...Prefixes<Suffix>]
    // The second situation is that the rest item contributed no elements, in
    // this case we don't have a rest item at all so we can treat the suffix
    // the same way we treat the prefix, partializing the tail.
    | PartialTail<Suffix>
  : // For fixed-elements arrays the required prefix is always fully included
    // when we reach the suffix.
    [...Required, ...CoercedArray<Item>, ...Prefixes<Suffix>];

/**
 * This type assumes that T is a fixed tuple (no optional part and no rest
 * item).
 *
 * @returns A reconstructed tuple where the first item in T is required, and
 * all the rest are optional.
 * @example PartialTail<['a', 'b', 'c']> //=> ['a', 'b'?, 'c'?]
 */
type PartialTail<T> = T extends readonly [infer Head, ...infer Tail]
  ? [Head, ...PartialArray<Tail>]
  : never;

/**
 * This type assumes that T is a fixed tuple (no optional part and no rest
 * item).
 *
 * @returns The union of the fixed tuples of length L in range `(1, n]`
 * where `[T[0], T[1], ..., T[L-1]]`.
 * @example Prefixes<['a', 'b', 'c', 'd']> //=> ['a'] | ['a', 'b'] | ['a', 'b', 'c'] | ['a', 'b', 'c', 'd']
 */
type Prefixes<T, Prefix extends unknown[] = []> = T extends readonly [
  infer Head,
  ...infer Rest,
]
  ? [...Prefix, Head] | Prefixes<Rest, [...Prefix, Head]>
  : never;
