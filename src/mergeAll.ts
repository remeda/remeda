import type { SharedUnionFields, Simplify } from "type-fest";
import type { IsUnion } from "./internal/types/IsUnion";
import type { SharedUnionFieldsComplement } from "./internal/types/SharedUnionFieldsComplement";

/**
 * Merges all types of the union into a single object type. Fields that are not shared among all types of the union become optional.
 */
type MergeUnionWithOptionalComplement<T extends object> = SharedUnionFields<T> &
  Partial<SharedUnionFieldsComplement<T>>;

type MergeAllArrayResult<T extends object> =
  | (IsUnion<T> extends true
      ? Simplify<MergeUnionWithOptionalComplement<T>>
      : T)
  | Record<string, never>;

/**
 * Merges a list of objects into a single object.
 *
 * @param array - The array of objects.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
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

/**
 * Merges a list of objects into a single object.
 *
 * @param array - The array of objects.
 * @returns A new object merged with all of the objects in the list. If the list is empty, an empty object is returned.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 * @category Array
 */
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
