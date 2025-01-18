import type { EmptyObject, SharedUnionFields, Simplify } from "type-fest";
import type { DisjointUnionFields } from "./internal/types/DisjointUnionFields";

// In the context of a heterogeneous array, the array may not have objects from every type of the union.
// This means some fields may be missing in the final object, so we make them optional.
// If there is a non-optional field shared among all members of the union, then we know that if the array is not empty, the field must be present and avoid becoming optional.
// If the field is already optional, this doesn't really matter.
// If the array is empty, we know that the loop won't run so we'll just get the empty object.
// Since we don't know the order of the items in the array, when we merge common fields, we don't know what the final type for the field will be, but we do know that it is one of the many possible types that are available across the members of the union for that field.
// We represent these possibilities by combining the field's different types across the union members into a union.
type MergeAll<T extends object> =
  | Simplify<SharedUnionFields<T> & Partial<DisjointUnionFields<T>>>
  | EmptyObject;

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
export function mergeAll<A>(objects: readonly [A]): A;
export function mergeAll<A, B>(objects: readonly [A, B]): A & B;
export function mergeAll<A, B, C>(objects: readonly [A, B, C]): A & B & C;
export function mergeAll<A, B, C, D>(
  objects: readonly [A, B, C, D],
): A & B & C & D;
export function mergeAll<A, B, C, D, E>(
  objects: readonly [A, B, C, D, E],
): A & B & C & D & E;
export function mergeAll<T extends object>(
  objects: ReadonlyArray<T>,
): MergeAll<T>;
export function mergeAll<T extends object>(
  objects: ReadonlyArray<T>,
): MergeAll<T> {
  let out = {};

  for (const item of objects) {
    out = { ...out, ...item };
  }

  return out;
}
