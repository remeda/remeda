import type { IsAny, IsNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { CommonSubtype } from "./CommonSubtype";
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
          ...CoercedArray<CommonSubtype<TupleParts<T>["item"], Condition>>,
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
  ? IsAny<Head> extends true
    ? // `any` would satisfy the `[Head] extends [Condition]` check below,
      // leaking `any` itself into the output. But it isn't a guaranteed
      // match either, so we consider both the skipped case and the matched
      // case.
      | FilteredFixedTuple<Rest, Condition>
      | [
          CommonSubtype<Head, Condition, true /* RequireSharedKey */>,
          ...FilteredFixedTuple<Rest, Condition>,
        ]
    : // The check is wrapped in tuples so that it doesn't distribute over
      // union heads; a union item stays a single union-typed element in the
      // output instead of fanning out into every combination.
      [Head] extends [Condition]
      ? // If the item in the array already satisfies the condition we pass it
        // through to the output.
        [Head, ...FilteredFixedTuple<Rest, Condition>]
      : // The item doesn't satisfy the condition, but it might share a refined
        // type with it, so it would still show up in the output; to
        // accommodate for this we consider both cases for the output.
        | FilteredFixedTuple<Rest, Condition>
        | (IsNever<
            CommonSubtype<Head, Condition, true /* RequireSharedKey */>
          > extends true
            ? // The item is entirely disjoint from the condition, it would
              // never match.
              never
            : [
                // Instead of adding the item as-is, we add the common sub-type
                // of both `Head` and `Condition`.
                CommonSubtype<Head, Condition, true /* RequireSharedKey */>,
                ...FilteredFixedTuple<Rest, Condition>,
              ])
  : // Our inputs are fixed-tuples so we reach here only when T is exactly `[]`.
    [];
