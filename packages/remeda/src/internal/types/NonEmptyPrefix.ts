import type { IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

/**
 * For utilities that support lazy evaluation (like `map`, `filter`, etc...)
 * `pipe` builds the callback's `data` parameter (which in the standard library
 * is the array reference itself) lazily too, item by item, as the items flow
 * through the pipe. This means that unlike the standard library, we can't type
 * the parameter as the plain input array T. Instead, we need to compute a shape
 * that represents a partial prefix of the input T, and we want to maintain as
 * much of the input shape as possible. This will prevent unchecked array access
 * for items which haven't been computed and added to the array yet.
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
 *   function map<T extends IterableContainer, U>(
 *     data: T,
 *     callbackfn: (value: T[number], index: number, data: T) => U,
 *   ): Mapped<T, U>;
 *
 *   // data-last (lazy, via `pipe`)
 *   function map<T extends IterableContainer, U>(
 *     callbackfn: LazyCallback<T, U>,
 *   ): (data: T) => Mapped<T, U>;
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
    ? // Only empty tuple types have neither a prefix nor a rest item, they also
      // don't have any prefixes!
      never
    : // Without a prefix part the prefix is just a simple non-empty array
      // shape.
      [Item, ...Item[]]
  : // When we have a non-trivial prefix then it has a first item, and all
    // remaining items are optional by definition. We add the rest item if it
    // exists.
    [...PartialTail<Prefix>, ...CoercedArray<Item>];

// Non-trivial suffixes only show up in two tuple shapes: fixed-suffix arrays
// and fixed-elements arrays (see the definitions in the `TupleParts` docs).
// Both have no optional part and a non-trivial rest item, and differ only in
// whether they have a required prefix. TypeScript doesn't support optional
// elements after a rest element, so the suffix can't be partialized in place;
// instead each prefix of the suffix becomes its own union member. For every
// other tuple shape `Suffix` is `[]`, so `Prefixes<[]>` and `PartialTail<[]>`
// are both `never` and spreading them collapses the whole member to `never`.
type SuffixPrefixes<
  Required extends unknown[],
  Item,
  Suffix,
> = Required extends readonly []
  ? // Without a required prefix the general formula below would yield
    // `[...Item[], ...Suffix]`. TypeScript doesn't consider a tuple with a
    // leading rest element assignable to `[T, ...T[]]` (`NonEmptyArray`), even
    // though its minimum length is 1, so `data` could no longer be passed to
    // anything typed as non-empty. To keep every member structurally non-empty
    // we hoist the rest item's first iteration into a required slot...
    | [Item, ...Item[], ...Prefixes<Suffix>]
    // ...and enumerate the zero-iteration case separately, where the suffix is
    // the whole tuple and can be partialized like a prefix.
    | PartialTail<Suffix>
  : // With a required prefix the first element is already required, so the
    // rest item can stay a plain rest element.
    [...Required, ...CoercedArray<Item>, ...Prefixes<Suffix>];

/**
 * Reconstructs a fixed tuple so that its first item is required and all the
 * rest are optional. Assumes that T is a fixed tuple (no optional part and no
 * rest item).
 *
 * @example PartialTail<['a', 'b', 'c']> //=> ['a', 'b'?, 'c'?]
 */
type PartialTail<T> = T extends readonly [infer Head, ...infer Tail]
  ? [Head, ...PartialArray<Tail>]
  : never;

/**
 * The union of every non-empty prefix of a fixed tuple: for each L in
 * `[1, n]`, the tuple `[T[0], ..., T[L-1]]`. Assumes that T is a fixed tuple
 * (no optional part and no rest item).
 *
 * @example Prefixes<['a', 'b', 'c', 'd']> //=> ['a'] | ['a', 'b'] | ['a', 'b', 'c'] | ['a', 'b', 'c', 'd']
 */
type Prefixes<T> = T extends readonly [infer Head, ...infer Rest]
  ? [Head] | [Head, ...Prefixes<Rest>]
  : // We return `never` for the empty array to skip adding `[]` to every
    // output. This also works with the recursion above when `[Head, ...never]`
    // would fold to `never`.
    never;
