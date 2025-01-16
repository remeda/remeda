import type { EmptyObject, SharedUnionFields, Simplify } from "type-fest";
import type { IsUnion } from "./internal/types/IsUnion";
import type { SharedUnionFieldsComplement } from "./internal/types/SharedUnionFieldsComplement";

/**
 * Merges all types of the union into a single object type. Fields that are not shared among all types of the union become optional.
 */
type MergeUnionWithOptionalSharedUnionFieldsComplement<T extends object> =
  SharedUnionFields<T> & Partial<SharedUnionFieldsComplement<T>>;

// In the context of a heterogeneous array, the array may not have objects from every type of the union.
// This means some fields may be missing in the final object, so we make them optional.
// If there is a non-optional field shared among all members of the union, then we know that if the array is not empty, the field must be present and avoid becoming optional.
// If the field is already optional, this doesn't really matter.
// If the array is empty, we know that the loop won't run so we'll just get the empty object.
// Since we don't know the order of the items in the array, when we merge common fields, we don't know what the final type for the field will be, but we do know that it is one of the many possible types that are available across the members of the union for that field.
// We represent these possibilities by combining the field's different types across the union members into a union.
// It's important to distinguish between fields shared among all members of the union and fields that are only shared among some members of the union.
type MergeAllArrayResult<T extends object> =
  | (IsUnion<T> extends true
      ? Simplify<MergeUnionWithOptionalSharedUnionFieldsComplement<T>>
      : T) // if the input is a homogeneous non-empty array, we know the result type will just be the type of the contents of the array since the merges won't change any field types
  | EmptyObject;

/**
 * Merges a list of objects into a single object.
 *
 * @param array - The array of objects.
 * @returns A new object merged with all of the objects in the list. If the list is empty, an empty object is returned.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 * @example
 *    R.mergeAll([]) // => {}
 * @category Array
 */
export function mergeAll<A>(array: readonly [A]): A;
export function mergeAll<A, B>(array: readonly [A, B]): A & B;
export function mergeAll<A, B, C>(array: readonly [A, B, C]): A & B & C;
export function mergeAll<A, B, C, D>(
  array: readonly [A, B, C, D],
): A & B & C & D;
export function mergeAll<A, B, C, D, E>(
  array: readonly [A, B, C, D, E],
): A & B & C & D & E;
export function mergeAll<T extends object>(
  array: ReadonlyArray<T>,
): MergeAllArrayResult<T>;
export function mergeAll<T extends object>(
  items: ReadonlyArray<T>,
): MergeAllArrayResult<T> {
  let out = {};

  for (const item of items) {
    out = { ...out, ...item };
  }

  return out;
}
