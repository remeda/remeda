import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { PartialArray } from "./PartialArray";
import type { TupleParts } from "./TupleParts";

// TODO: Migrate all usages of type-fest's `Writable` to this one!
/**
 * Drop-in replacement for type-fest's `Writable` type that retains the input's
 * shape.
 */
export type Writable<T extends IterableContainer> =
  // We distribute the array type to support unions of arrays/tuples.
  T extends unknown
    ? // This is exactly the array reconstruction from the TupleParts example.
      [
        ...TupleParts<T>["required"],
        ...PartialArray<TupleParts<T>["optional"]>,
        ...CoercedArray<TupleParts<T>["item"]>,
        ...TupleParts<T>["suffix"],
      ]
    : never;
