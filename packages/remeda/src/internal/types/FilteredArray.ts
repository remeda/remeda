import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

export type FilteredArray<T extends IterableContainer, Condition> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? // Reconstruct the array from its parts, but with each part being
      // filtered on the condition.
      [
        ...FilteredFixedTuple<TupleParts<T>["required"], Condition>,

        // The optional elements are added as if they were required instead.
        // This is because when building the filtered fixed tuples we create
        // unions of possible outcomes, simulating the way optional elements
        // work.
        ...FilteredFixedTuple<TupleParts<T>["optional"], Condition>,

        ...CoercedArray<SymmetricRefine<TupleParts<T>["item"], Condition>>,
        ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition>,
      ]
    : never;

// The real logic for filtering an array is done on fixed tuples (as those make
// up the required prefix, the optional prefix, and the suffix of the array).
type FilteredFixedTuple<
  T,
  Condition,
  Output extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Rest]
  ? FilteredFixedTuple<
      Rest,
      Condition,
      Head extends Condition
        ? // If the item in the array already satisfies the condition we pass
          // it through to the output.
          [...Output, Head]
        : Head | Condition extends object
          ? // TypeScript defines "extends" for objects differently than it
            // does for primitives, e.g. `{ a: string, b: number }` extends
            // `{ a: string }` because any function that would accept the latter
            // would be able to accept the former (by ignoring the extra props)
            // because TypeScript is structurally typed; but for filtering we
            // want the opposite semantics, and at this point we already know
            // that that is false, so we can safely say this item doesn't meet
            // the condition and skip it.
            Output
          : Condition extends Head
            ? // But for any other type (mostly primitives), if the condition
              // extends the item it means that there are situations where the
              // item could satisfy the condition and cases where it won't
              // (e.g. if the item type is `string` and the condition type is
              // `"hello"`, then item could be `"hello"` or it could be any
              // other string, e.g. `"world"`). In this case we need to take
              // both into consideration in the output type.
              Output | [...Output, Condition]
            : // But if the item and condition are disjoint then we simply skip
              // it as it would never satisfy the condition.
              Output
    >
  : Output;

// This type is similar to the built-in `Extract` type, but allows us to have
// either Item or Condition be narrower than the other.
type SymmetricRefine<Item, Condition> = Item extends Condition
  ? Item
  : Condition extends Item
    ? Condition
    : never;
