import type { ArrayIndices, IsNumericLiteral } from "type-fest";
import type { ClampedIntegerSubtract } from "./ClampedIntegerSubtract";
import type { IntRangeInclusive } from "./IntRangeInclusive";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";
import type { If } from "./If";

/**
 * The type for the I'th element in the tuple T. This type corrects some of the
 * issues with TypeScript's built-in tuple accessor inference `T[I]` for arrays
 * and tuples with fixed suffixes, and for primitive indices where we don't know
 * if the index is out of bounds.
 */
export type ArrayAt<T extends IterableContainer, I extends keyof T> = If<
  // Only literals pose a challenge to the typing system because they refer to a
  // specific element within the array.
  IsNumericLiteral<I>,
  // The result of a union of indices is a union of the results for each one, so
  // we distribute the union.
  I extends unknown
    ? // We memoize the prefix (made of the required and optional parts) so we
      // can reuse it several times within this type.
      [
        ...TupleParts<T>["required"],
        ...TupleParts<T>["optional"],
      ] extends infer Prefix extends ReadonlyArray<unknown>
      ? If<
          // The first two parts of the tuple, the required and the optional
          // prefixes, are simple and TypeScript does a good job of typing them
          // based on indexing the tuple directly.
          HasIndex<Prefix, I>,
          T[I],
          // The index is larger than the prefix so the result has to consider
          // the rest element item type.
          | TupleParts<T>["item"]
          // We subtract the prefix length from the index to get the index
          // within the suffix.
          | (ClampedIntegerSubtract<
              I,
              Prefix["length"]
            > extends infer SuffixIndex extends number
              ? If<
                  // If the index falls within the suffix it means that the item
                  // might be of that element's type, but it also could be any
                  // value that came before it in the suffix, because the rest
                  // element part of the array could be any length: e.g.,
                  // for `[...0[], 1, 2, 3]` the tuple could have the
                  // shape: `[1, 2, 3]`, `[0, 1, 2, 3]`, `[0, 0, 1, 2, 3]`,
                  // etc... if we look at a single index within the suffix we
                  // can see the the rest param acts as a window into the
                  // suffix, but only the prefixes up to that index. e.g., if
                  // index is 1, in the example above the item could be of type
                  // `2 | 1 | 0`.
                  HasIndex<TupleParts<T>["suffix"], SuffixIndex>,
                  TupleParts<T>["suffix"][IntRangeInclusive<0, SuffixIndex>],
                  // But if the index is out of the suffix it can be out-of-
                  // bounds, resulting in `undefined`, or it could be any of the
                  // items in the suffix (depending on how long the rest part of
                  // the tuple is).
                  TupleParts<T>["suffix"][number] | undefined
                >
              : never)
        >
      : never
    : never,
  // Even with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
  // enabled TypeScript still types T[number] without considering that number
  // might be out of bounds. We need to manually add the `undefined` case to
  // make the type accurate.
  T[number] | undefined
>;

type HasIndex<T extends ReadonlyArray<unknown>, I> =
  I extends ArrayIndices<T> ? true : false;
