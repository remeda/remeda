import type { KeysOfUnion, SharedUnionFields } from "type-fest";

/**
 * Gets the complement of the keys of {@link SharedUnionFields} from a union.
 */
export type SharedUnionFieldKeysComplement<T extends object> = Exclude<
  KeysOfUnion<T>,
  keyof SharedUnionFields<T>
>;
