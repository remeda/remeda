import type { KeysOfUnion, SharedUnionFields } from "type-fest";

/**
 * Gets the set of keys that are not shared by all members of a union. This is the complement of the keys of {@link SharedUnionFields}.
 */
type DisjointUnionFieldKeys<T extends object> = Exclude<
  KeysOfUnion<T>,
  keyof SharedUnionFields<T>
>;

/**
 * Gets the set of fields that are not shared by all members of a union. This is the complement of {@link SharedUnionFields}.
 */
export type DisjointUnionFields<T extends object> = {
  [K in DisjointUnionFieldKeys<T>]: T extends Partial<Record<K, unknown>> // if T contains K (distributed, can be optional)
    ? T[K]
    : never;
};
