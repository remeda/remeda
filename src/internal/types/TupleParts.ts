import type { IsEqual } from "type-fest";

/**
 * Takes an array and returns the types that make up its parts. The prefix is
 * anything before the rest parameter (if any), the suffix is anything after
 * the rest parameter (if any), and the item is the type of the rest parameter.
 *
 * The output could be used to reconstruct the input: `[
 *   ...TupleParts<T>["prefix"],
 *   ...Array<TupleParts<T>["item"]>,
 *   ...TupleParts<T>["suffix"],
 * ]`.
 */
export type TupleParts<
  T,
  Prefix extends Array<unknown> = [],
  Suffix extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Tail]
  ? TupleParts<Tail, [...Prefix, Head], Suffix>
  : T extends readonly [...infer Head, infer Tail]
    ? TupleParts<Head, Prefix, [Tail, ...Suffix]>
    : // We need to distinguish between e.g. [number? ...Array<string>] and
      // Array<number | string>.
      IsTupleRestOnly<T> extends false
      ? // This is the [number? ...Array<string>] case.
        T extends readonly [(infer MaybeHead)?, ...infer Tail]
        ? TupleParts<Tail, [...Prefix, MaybeHead?], Suffix>
        : never
      : // This is the Array<number | string> case.
        T extends ReadonlyArray<infer Item>
        ? {
            prefix: Prefix;
            item: Item;
            suffix: Suffix;
          }
        : never;

/**
 * Helper type for `TupleParts`. Checks if T = ReadonlyArray<U> for some U.
 */
type IsTupleRestOnly<T> = T extends readonly []
  ? true
  : T extends readonly [unknown?, ...infer Tail]
    ? IsEqual<Readonly<T>, Readonly<Tail>>
    : false;
