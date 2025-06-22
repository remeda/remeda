import type { IfNever } from "type-fest";

/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
export type EnumerableStringKeyedValueOf<T> = T extends unknown
  ? IfNever<
      Exclude<keyof T, symbol>,
      never,
      Required<T>[Exclude<keyof T, symbol>]
    >
  : never;
