import type { IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

/**
 * The `data` param of a lazy callback: `pipe` might hand it only a prefix of
 * the input. Only the data-last overload is lazy; the data-first overload runs
 * eagerly over the complete input, so its callback gets the input type itself.
 *
 * It is readonly so the callback can't mutate it: it is either `pipe`'s
 * buffer, which later items are added to, or the caller's own input array.
 *
 * @example
 *   // data-first (eager)
 *   function map<T extends IterableContainer, U>(
 *     data: T,
 *     callbackfn: (value: T[number], index: number, data: T) => U,
 *   ): Mapped<T, U>;
 *
 *   // data-last (lazy, via `pipe`)
 *   function map<T extends IterableContainer, U>(
 *     callbackfn: (value: T[number], index: number, data: LazyData<T>) => U,
 *   ): (data: T) => Mapped<T, U>;
 */
export type LazyData<T extends IterableContainer> =
  // `data` must not be an inference site for `T`: when the piped input is
  // generic (e.g. `readonly T[]`) and the callback declares `data`, TypeScript
  // can infer `T` from it instead of from the input, failing the call. The
  // indexed access is deferred while `T` is still being inferred, so nothing is
  // inferred through it, and it resolves to `NonEmptyPrefix<T>` once `T` is
  // fixed.
  // TODO [>2]: Once the minimum supported TypeScript version is 5.4 or later, move `Readonly` inside the indexed access (`{ data: Readonly<NonEmptyPrefix<T>> }[T extends unknown ? "data" : never]`): it's cheaper still, but doesn't block the inference before 5.4.
  Readonly<{ data: NonEmptyPrefix<T> }[T extends unknown ? "data" : never]>;

/**
 * For utilities that support lazy evaluation (like `map`, `filter`, etc...)
 * `pipe` can build the callback's `data` parameter (which in the standard
 * library is the array reference itself) lazily too, item by item, as the items
 * flow through a fused sequence of lazy functions. Whether a step fuses depends
 * on the rest of the pipe, which the callback's type can't see. This means that
 * unlike the standard library, we can't type the parameter as the plain input
 * array T. Instead, we need to compute a shape that represents a partial prefix
 * of the input T, and we want to maintain as much of the input shape as
 * possible. This will prevent unchecked array access for items which haven't
 * been computed and added to the array yet.
 *
 * Additionally, because the callback is always called when at least the first
 * item is already being processed we can further refine our type so that it has
 * a required first item (e.g., the array is not empty), similar to calling
 * `hasAtLeast(1)` on the shape we computed.
 */
type NonEmptyPrefix<T extends IterableContainer> =
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
