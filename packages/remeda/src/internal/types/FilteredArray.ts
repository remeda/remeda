import type { IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

export type FilteredArray<T extends IterableContainer, Condition> =
  IsNever<Condition> extends true
    ? // Nothing can satisfy a condition of `never`.
      []
    : // We distribute the array type to support unions of arrays/tuples.
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
type FilteredFixedTuple<T, Condition> = T extends readonly [
  infer Head,
  ...infer Rest,
]
  ? Head extends Condition
    ? // If the item in the array already satisfies the condition we pass it
      // through to the output.
      [Head, ...FilteredFixedTuple<Rest, Condition>]
    : // The item doesn't satisfy the condition, but it might share a refined
      // type with it, so it would still show up in the output; to accommodate
      // for this we consider both cases for the output.
      | FilteredFixedTuple<Rest, Condition>
      | (IsNever<SymmetricRefine<Head, Condition>> extends true
          ? // The item is entirely disjoint from the condition, it would never
            // match.
            never
          : [
              // Instead of adding the item as-is, we add the common refined
              // base type.
              SymmetricRefine<Head, Condition>,
              ...FilteredFixedTuple<Rest, Condition>,
            ])
  : // Our inputs are fixed-tuples so we reach here only when T is exactly `[]`.
    [];

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
type RefineIncomparable<Item, Condition> =
  IsRealObject<Item> extends true
    ? IsRealObject<Condition> extends true
      ? // We take the (symmetric) intersection of the two objects; but only
        // when we know it isn't empty. This would only happen if they share at
        // least one key.
        IsNever<Extract<keyof Item, keyof Condition>> extends true
        ? never
        : Item & Condition
      : never
    : never;

// Arrays are objects but they don't behave like ones because they have
// different `extend` and `keyof` semantics.
type IsRealObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;
