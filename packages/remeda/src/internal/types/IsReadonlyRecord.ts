import type { IsEqual, ReadonlyKeysOf } from "type-fest";

/**
 * Check if `T` is a readonly record.
 *
 * @example
 * ```ts
 * type A = IsReadonlyRecord<{ readonly a: 1 }>; // true
 * type B = IsReadonlyRecord<{ a: 1 }>; // false
 * ```
 */
export type IsReadonlyRecord<T> = IsEqual<keyof T, ReadonlyKeysOf<T>>;
