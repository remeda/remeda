import type { IfNever } from "type-fest";

/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
export type EnumerableStringKeyedValueOf<T> =
  // Distribute the union so that the result is the union of outputs of all
  // possible inputs.
  T extends unknown
    ? IfNever<
        Exclude<keyof T, symbol>,
        // If the only keys in T are symbols then there are no enumerable values
        // in the object.
        never,
        // Otherwise we take all possible values from all remaining keys. We use
        // Required to make sure we don't include `undefined` in the result if
        // props are only optional but don't take `undefined` as a value.
        // (because we adhere to `exactOptionalPropertyTypes`).
        Required<T>[Exclude<keyof T, symbol>]
      >
    : never;
