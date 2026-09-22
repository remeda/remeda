import type { Assignability } from "./Assignability";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { Narrowed } from "./Narrowed";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

/**
 * The result of filtering `T` by the `Condition`, with an optional `IsNegated`
 * to flip the condition semantics.
 *
 * @see filter
 * @see groupByProp
 * @see partition (uses `IsNegated`)
 */
export type FilteredArray<
  T extends IterableContainer,
  Condition,
  IsNegated extends boolean = false,
> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? // Reconstruct the tuple shape after filtering the items in each of its
      // parts, based on the example in  the docs for `TupleParts`.
      [
        ...FilteredFixedTuple<TupleParts<T>["required"], Condition, IsNegated>,
        ...PartialArray<
          FilteredFixedTuple<TupleParts<T>["optional"], Condition, IsNegated>
        >,
        ...CoercedArray<
          RefinedItem<TupleParts<T>["item"], Condition, IsNegated>
        >,
        ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition, IsNegated>,
      ]
    : never;

// We assume that T is a fixed tuple without any optional items or a rest item.
type FilteredFixedTuple<
  T,
  Condition,
  IsNegated extends boolean,
> = T extends readonly [infer Head, ...infer Rest]
  ? [
      ...FilteredItem<Head, Condition, IsNegated>,
      ...FilteredFixedTuple<Rest, Condition, IsNegated>,
    ]
  : [];

// What we add to the output depends on two things, how well does the item
// match the condition, and if we are negating the condition or not.
type FilteredItem<Item, Condition, IsNegated extends boolean> = Assignability<
  Item,
  Condition,
  {
    full: IsNegated extends true ? [] : [Item];
    none: IsNegated extends true ? [Item] : [];

    // The interesting case comes when the item might or might not match the
    // condition. We fork our output to cover both cases; to handle the
    // case the item matches the condition we narrow its type so that it
    // always matches the condition and add it to the output; and to handle
    // the case the item doesn't match we simply don't add anything to the
    // output.
    partial: [RefinedItem<Item, Condition, IsNegated>] | [];
  }
>;

type RefinedItem<
  Item,
  Condition,
  IsNegated extends boolean,
> = IsNegated extends true
  ? // This is the closest type TypeScript provides to what the `else` branch of
    // `if` statements with narrowing conditions produces.
    Exclude<Item, Condition>
  : // For the non-negated case our `Narrowed` type allows `Condition` to be
    // wider than the `Item` type, generating a type that can still be
    // assignable to both types.
    Narrowed<Item, Condition>;
