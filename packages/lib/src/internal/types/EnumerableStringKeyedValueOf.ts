import type { EmptyObject } from "type-fest";

/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
export type EnumerableStringKeyedValueOf<T> = ValuesOf<{
  [K in keyof T]-?: K extends symbol ? never : T[K];
}>;

/**
 * Extracts the value type from an object type T.
 */
type ValuesOf<T> =
  // EmptyObject is used to infer value type as never instead of unknown
  // for an empty object
  T extends EmptyObject
    ? T[keyof T]
    : T extends Record<PropertyKey, infer V>
      ? V
      : never;
