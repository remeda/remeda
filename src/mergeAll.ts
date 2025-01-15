import type { KeysOfUnion, SharedUnionFields, Simplify } from "type-fest";
import type { IsUnion } from "./internal/types/IsUnion";

/**
 * Gets the union of the field value types from the types of the union where the key exists.
 */
type PickUnionValue<T extends object, K extends KeysOfUnion<T>> =
  T extends Partial<Record<K, unknown>> // if T contains K (distributed, can be optional)
    ? T[K]
    : never;

/**
 * Gets the complement of the keys of SharedUnionFields from a union.
 */
type SharedUnionFieldKeysComplement<T extends object> = Exclude<
  KeysOfUnion<T>,
  keyof SharedUnionFields<T>
>;

/**
 * Gets the complement of SharedUnionFields from a union.
 */
type SharedUnionFieldsComplement<T extends object> = {
  [K in SharedUnionFieldKeysComplement<T>]: PickUnionValue<T, K>;
};

/**
 * Merges all types of the union into a single object type. Fields that are not shared among all types of the union become optional.
 */
type MergeUnion<T extends object> = SharedUnionFields<T> &
  Partial<SharedUnionFieldsComplement<T>>;

type MergeAllResult<T extends object> =
  IsUnion<T> extends true ? Simplify<MergeUnion<T>> | object : T | object;

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
export function mergeAll<T extends object>(
  array: ReadonlyArray<T>,
): MergeAllResult<T>;

export function mergeAll<T extends object>(
  items: ReadonlyArray<T>,
): MergeAllResult<T> {
  let out = {};

  for (const item of items) {
    out = { ...out, ...item };
  }

  return out;
}
