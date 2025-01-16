import type { Merge } from "type-fest";

/**
 * Merges a tuple of objects types into a single object type from left to right.
 */
export type MergeTuple<
  T extends ReadonlyArray<unknown>, // ideally unknown is narrowed to object for type safety but this is being used by mergeAll and would require additional object constraint on the function, could be a breaking change
  _Current = object, // no-op for the first iteration in the successive merges, also infers object as type by default if an empty tuple is used
> = T extends readonly [infer Head, ...infer PoppedStack] // if stack not empty
  ? MergeTuple<PoppedStack, Merge<_Current, Head>>
  : _Current;
