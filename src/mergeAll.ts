import type {
  EmptyObject,
  Merge,
  SharedUnionFields,
  Simplify,
} from "type-fest";
import type { DisjointUnionFields } from "./internal/types/DisjointUnionFields";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { TupleParts } from "./internal/types/TupleParts";

/**
 * Merge a tuple of object types, where props from later objects override earlier props.
 */
type MergeTuple<
  T extends IterableContainer,
  Result = object, // no-op for the first iteration in the successive merges, also infers object as type by default if an empty tuple is used
> = T extends readonly [infer Head, ...infer Rest]
  ? MergeTuple<Rest, Merge<Result, Head>>
  : Result;

// In the context of a heterogeneous array, the array may not have objects from every type of the union.
// This means some fields may be missing in the final object, so we make them optional.
// If there is a non-optional field shared among all members of the union, then we know that if the array is not empty, the field must be present and avoid becoming optional.
// If the field is already optional, this doesn't really matter.
// If the array is empty, we know that the loop won't run so we'll just get the empty object.
// Since we don't know the order of the items in the array, when we merge common fields, we don't know what the final type for the field will be, but we do know that it is one of the many possible types that are available across the members of the union for that field.
// We represent these possibilities by combining the field's different types across the union members into a union.
type MergeUnion<T extends object> = Simplify<
  SharedUnionFields<T> & Partial<DisjointUnionFields<T>>
>;

type MergeAll<T extends IterableContainer<object>> =
  // determine if it's a tuple or array
  TupleParts<T> extends { item: never }
    ? T extends readonly []
      ? EmptyObject
      : MergeTuple<T>
    : MergeUnion<T[number]> | EmptyObject;

type NonemptyReadonlyArray<T> = readonly [T, ...Array<T>];

/**
 * Merges a list of objects into a single object.
 *
 * @param objects - The array of objects.
 * @returns A new object merged with all of the objects in the list. If the list is empty, an empty object is returned.
 * @signature
 *    R.mergeAll(array)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 *    R.mergeAll([]) // => {}
 * @dataFirst
 * @category Array
 */
export function mergeAll<T extends object>(
  objects: NonemptyReadonlyArray<T>,
): MergeUnion<T>;
export function mergeAll<T extends IterableContainer<object>>(
  objects: T,
): MergeAll<T>;
export function mergeAll<T extends IterableContainer<object>>(
  objects: T,
): MergeAll<T> {
  let out = {};

  for (const item of objects) {
    out = { ...out, ...item };
  }

  // @ts-expect-error the return type will work out - see the type tests.
  return out;
}
