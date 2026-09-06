import type { Assignability } from "./Assignability";
import type { IterableContainer } from "./IterableContainer";
import type { Narrowed } from "./Narrowed";
import type { WritableTuple } from "./WritableTuple";

/**
 * The items of `T` narrowed to `Condition`, for functions that return a
 * contiguous run of the input (a prefix or a suffix) rather than a selection
 * of its items like `FilteredArray` does. Any item could be the one that ends
 * the run, so a shape-aware result would be a union of every possible run,
 * which isn't useful in practice; instead we only keep the input's shape when
 * the predicate is trivial for all of its items.
 *
 * @see takeWhile
 * @see takeLastWhile
 */
export type NarrowedArray<T extends IterableContainer, Condition> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? Assignability<
        T[number],
        Condition,
        {
          full: WritableTuple<T>;
          partial: Narrowed<T[number], Condition>[];
          none: [];
        }
      >
    : never;
