import type { Writable } from "type-fest";
import type { IterableContainer } from "./IterableContainer";

/**
 * When the predicate used for filter isn't refining (like a type-predicate) we
 * can narrow the result slightly if it's also trivial (it returns the same
 * result for all items). This is uncommon, but can be useful to
 * "short-circuit" the filter.
 */
export type NonRefinedFilteredArray<
  T extends IterableContainer,
  IsItemIncluded extends boolean,
> = boolean extends IsItemIncluded
  ? // We don't know which items of the array the predicate would allow in the
    // output so we can only safely say that the result is an array with items
    // from the input array.
    // TODO: Theoretically we could build an output shape that would take into account the **order** of elements in the input array by reconstructing it with every single element in it either included or not, but this type can grow to a union of as much as 2^n options which might not be usable in practice.
    T[number][]
  : IsItemIncluded extends true
    ? // If the predicate is always true we return a shallow copy of the array.
      // If it was originally readonly we need to strip that away.
      Writable<T>
    : // If the predicate is always false we will always return an empty
      // array.
      [];
