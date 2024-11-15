import type { IsEqual } from "type-fest";

/**
 * Takes an array and returns the types that make up its parts. The prefix is
 * anything before the rest parameter (if any), split between it's required
 * part, and it's optional part. The suffix is anything after the rest
 * parameter (if any), and the item is the type of the rest parameter.
 *
 * NOTE: The prefix is split into 2 tuples where all items are non-optional so
 * that types that rely on the presence of a specific element can be built more
 * accurately.
 *
 * TODO: Some existing types use the `prefix` accessor which doesn't handle the optional part correctly. We need to fix each of those types before we can remove it.
 *
 * The output could be used to reconstruct the input: `[
 *   ...TupleParts<T>["required"],
 *   ...Partial<TupleParts<T>["optional"]>,
 *   ...CoercedArray<TupleParts<T>["item"]>,
 *   ...TupleParts<T>["suffix"],
 * ]`.
 */
export type TupleParts<
  T,
  PrefixRequired extends Array<unknown> = [],
  PrefixOptionals extends Array<unknown> = [],
  Suffix extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Tail]
  ? TupleParts<Tail, [...PrefixRequired, Head], PrefixOptionals, Suffix>
  : T extends readonly [...infer Head, infer Tail]
    ? TupleParts<Head, PrefixRequired, PrefixOptionals, [Tail, ...Suffix]>
    : // We need to distinguish between e.g. [number? ...Array<string>] and
      // Array<number | string>.
      IsTupleRestOnly<T> extends true
      ? // This is the Array<number | string> case.
        T extends ReadonlyArray<infer Item>
        ? {
            prefix: [...PrefixRequired, ...Partial<PrefixOptionals>];
            required: PrefixRequired;
            optional: PrefixOptionals;
            item: Item;
            suffix: Suffix;
          }
        : never
      : // This is the [number? ...Array<string>] case.
        T extends readonly [(infer OptionalHead)?, ...infer Tail]
        ? TupleParts<
            Tail,
            PrefixRequired,
            [...PrefixOptionals, OptionalHead],
            Suffix
          >
        : never;

/**
 * Helper type for `TupleParts`. Checks if T = ReadonlyArray<U> for some U.
 */
type IsTupleRestOnly<T> = T extends readonly []
  ? true
  : T extends readonly [unknown?, ...infer Tail]
    ? IsEqual<Readonly<T>, Readonly<Tail>>
    : false;
