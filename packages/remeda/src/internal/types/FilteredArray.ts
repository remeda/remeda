import type { IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

export type FilteredArray<T extends IterableContainer, Condition> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? // Reconstruct the array from its parts, but with each part being
      // filtered on the condition.
      [
        ...FilteredFixedTuple<TupleParts<T>["required"], Condition>,
        ...PartialArray<
          FilteredFixedTuple<TupleParts<T>["optional"], Condition>
        >,
        ...CoercedArray<SymmetricRefine<TupleParts<T>["item"], Condition>>,
        ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition>,
      ]
    : never;

/**
 * The real logic for filtering an array is done on fixed tuples (as those make
 * up the required prefix, the optional prefix, and the suffix of the array).
 */
type FilteredFixedTuple<T, Condition, Output extends unknown[] = []> =
  IsNever<Condition> extends true
    ? // A condition of `never` can never be satisfied so nothing is kept.
      []
    : T extends readonly [infer Head, ...infer Rest]
      ? FilteredFixedTuple<
          Rest,
          Condition,
          Head extends Condition
            ? // If the item in the array already satisfies the condition we
              // pass it through to the output.
              [...Output, Head]
            : // For items that don't satisfy the condition they still _might_
              // satisfy it in certain situations, so we construct the type
              // assuming both
              | Output
              | (Head | Condition extends object
                  ? // If both item and condition are objects...
                    IsNever<SymmetricRefine<Head, Condition>> extends true
                    ? // If the item is entirely disjoint we skip it.
                      never
                    : // Otherwise we add the more specific type to the output.
                      [...Output, SymmetricRefine<Head, Condition>]
                  : Condition extends Head
                    ? // But for any other type (mostly primitives), if the
                      // condition extends the item it means that there are
                      // situations where the item could satisfy the condition
                      // (e.g., if the item type is `string` and the condition
                      // type is `"hello"`, then item could be `"hello"` or it
                      // could be any other string, e.g. `"world"`).
                      [...Output, Condition]
                    : // If the item is entirely disjoint we skip it.
                      never)
        >
      : Output;

/**
 * This type is similar to the built-in `Extract` type, but allows us to have
 * either Item or Condition be narrower than the other.
 */
type SymmetricRefine<Item, Condition> = Item extends Condition
  ? Item
  : Condition extends Item
    ? Condition
    : RefineIncomparable<Item, Condition>;

/**
 * When types are incomparable (neither one extends the other) they might still
 * have a common refinement; this can happen when two objects share one or more
 * prop while both having distinct props too (e.g., `{ a: string; b: number }`
 * and `{ b: number, c: boolean }`), or when a prop is wider in one of them,
 * allowing more value types than the other (e.g.,
 * `{ a: "cat" | "dog", b: number }` and `{ a: "cat" }`).
 */
type RefineIncomparable<Item, Condition> = Item extends object
  ? Item extends readonly unknown[]
    ? never
    : Condition extends object
      ? Condition extends readonly unknown[]
        ? never
        : // We take the (symmetric) intersection of the two objects;
          // but only when we know it isn't empty. This would only happen if
          // they share at least one key.
          IsNever<Extract<keyof Item, keyof Condition>> extends true
          ? never
          : Item & Condition
      : never
  : never;
