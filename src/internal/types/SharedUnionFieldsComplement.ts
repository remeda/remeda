import type { PickUnionValue } from "./PickUnionValue";
import type { SharedUnionFieldKeysComplement } from "./SharedUnionFieldKeysComplement";

/**
 * Gets the complement of SharedUnionFields from a union.
 */
export type SharedUnionFieldsComplement<T extends object> = {
  [K in SharedUnionFieldKeysComplement<T>]: PickUnionValue<T, K>;
};
