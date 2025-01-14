import type { KeysOfUnion, SharedUnionFields, Simplify } from "type-fest";

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

type MergeAll<T extends object> = Simplify<MergeUnion<T>>;

declare const mergeAll: <T extends object>(
  array: ReadonlyArray<T>,
) => MergeAll<T>;

it("custom case", () => {
  // based on https://github.com/remeda/remeda/issues/918
  type UserWithPhone = { id: string; phone: number };
  type UserWithPhoneAsString = { id: string; phone: string };
  type UserWithName = { id: string; name: string; optianalTitle?: string };
  type UserUnion = UserWithName | UserWithPhone | UserWithPhoneAsString;
  const userUnionArray: ReadonlyArray<UserUnion> = [];

  type ExpectedResultType = {
    id: string;
    phone?: string | number;
    name?: string;
    optianalTitle?: string;
  };

  const mergedUserUnion = mergeAll(userUnionArray);

  expectTypeOf(mergedUserUnion).toEqualTypeOf<ExpectedResultType>();
});
