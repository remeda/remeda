import type { KeysOfUnion } from "type-fest";

/**
 * Gets the union of the field value types from the types of the union where the key exists.
 */
export type PickUnionValue<T extends object, K extends KeysOfUnion<T>> =
  T extends Partial<Record<K, unknown>> // if T contains K (distributed, can be optional)
    ? T[K]
    : never;
