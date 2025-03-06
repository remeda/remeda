import type { NonEmptyArray } from "./NonEmptyArray";
import type { IterableContainer } from "./IterableContainer";

/**
 * The result of running a function that would dedupe an array (`unique`,
 * `uniqueBy`, and `uniqueWith`).
 *
 * There are certain traits of the output which are unique to a deduped array
 * that allow us to create a better type; see comments inline.
 *
 * !Note: We can build better types for each of the unique functions
 * _separately_ by taking advantage of _other_ characteristics that are unique
 * to each one (e.g. in `unique` we know that each item that has a disjoint type
 * to all previous items would be part of the output, even when it isn't the
 * first), but to make this utility the most useful we kept it simple and
 * generic for now.
 */
export type Deduped<T extends Iterable<unknown>> = [T] extends [
  IterableContainer,
]
  ? T extends readonly []
    ? []
    : T extends readonly [infer Head, ...infer Rest]
      ? // has a first item, we can copy it over. The rest of the array is made of
        // whatever comes after that item.
        [Head, ...Array<Rest[number]>]
      : T extends readonly [...Array<unknown>, unknown]
        ? // is non empty, we can at least say that the output is non-empty as
          // well.
          NonEmptyArray<T[number]>
        : Array<T[number]>
  : T;
