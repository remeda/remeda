import type { IsAny, IsNever, Writable } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { Narrowed } from "./Narrowed";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

/**
 * The array that is left when `T` is filtered down to the items that satisfy
 * `Condition`, preserving as much of the input's shape as the condition allows.
 * Items which might or might not satisfy the condition turn the result into a
 * union of every shape they could yield.
 *
 * `IsNegated` computes the complementary array instead: the items that *fail*
 * the condition.
 */
export type FilteredArray<
  T extends IterableContainer,
  Condition,
  IsNegated extends boolean = false,
> =
  IsNever<Condition> extends true
    ? // Nothing can satisfy a condition of `never`, so every item fails it.
      IsNegated extends true
      ? Writable<T>
      : []
    : // We distribute the array type to support unions of arrays/tuples.
      T extends unknown
      ? // Reconstruct the array from its parts, but with each part being
        // filtered on the condition.
        [
          ...FilteredFixedTuple<
            TupleParts<T>["required"],
            Condition,
            IsNegated
          >,
          ...PartialArray<
            FilteredFixedTuple<TupleParts<T>["optional"], Condition, IsNegated>
          >,
          ...CoercedArray<
            RefinedItem<TupleParts<T>["item"], Condition, IsNegated>
          >,
          ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition, IsNegated>,
        ]
      : never;

/**
 * The real logic for filtering an array is done on fixed tuples (as those make
 * up the required prefix, the optional prefix, and the suffix of the array).
 */
type FilteredFixedTuple<
  T,
  Condition,
  IsNegated extends boolean = false,
> = T extends readonly [infer Head, ...infer Rest]
  ? IsAny<Head> extends true
    ? // `any` would satisfy the `[Head] extends [Condition]` check below,
      // leaking `any` itself into the output. But it isn't a guaranteed
      // match either, so we consider both the case where it is skipped and
      // the case where it is kept.
      | FilteredFixedTuple<Rest, Condition, IsNegated>
      | [
          RefinedItem<Head, Condition, IsNegated>,
          ...FilteredFixedTuple<Rest, Condition, IsNegated>,
        ]
    : // The check is wrapped in tuples so that it doesn't distribute over
      // union heads; a union item stays a single union-typed element in the
      // output instead of fanning out into every combination.
      [Head] extends [Condition]
      ? // The item always satisfies the condition, so it is always part of the
        // filtered output, and never part of the negated one.
        IsNegated extends true
        ? FilteredFixedTuple<Rest, Condition, IsNegated>
        : [Head, ...FilteredFixedTuple<Rest, Condition, IsNegated>]
      : IsNever<Narrowed<Head, Condition>> extends true
        ? // The item is entirely disjoint from the condition, so it is the
          // mirror image of the previous case.
          IsNegated extends true
          ? [Head, ...FilteredFixedTuple<Rest, Condition, IsNegated>]
          : FilteredFixedTuple<Rest, Condition, IsNegated>
        : // The item doesn't satisfy the condition, but it shares a refined
          // type with it, so it could end up in either output; to accommodate
          // for this we consider both cases.
          | FilteredFixedTuple<Rest, Condition, IsNegated>
          | [
              // Instead of adding the item as-is, we add the part of it that
              // the output it lands in can guarantee.
              RefinedItem<Head, Condition, IsNegated>,
              ...FilteredFixedTuple<Rest, Condition, IsNegated>,
            ]
  : // Our inputs are fixed-tuples so we reach here only when T is exactly `[]`.
    [];

/**
 * The type an item takes once it lands in the output: the common sub-type it
 * shares with the condition, or, for the negated output, what is left of it
 * when the condition is subtracted.
 */
type RefinedItem<
  Item,
  Condition,
  IsNegated extends boolean = false,
> = IsNegated extends true
  ? Exclude<Item, Condition>
  : Narrowed<Item, Condition>;
