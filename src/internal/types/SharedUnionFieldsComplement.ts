import type { PickUnionValue } from "./PickUnionValue";
import type { SharedUnionFieldKeysComplement } from "./SharedUnionFieldKeysComplement";

/**
 * Gets the complement of {@link SharedUnionFields} from a union. Similar in usage to {@link SharedUnionFieldKeysComplement} but gets the full key value pair.
 */
export type SharedUnionFieldsComplement<T extends object> = {
  [K in SharedUnionFieldKeysComplement<T>]: PickUnionValue<T, K>;
};
