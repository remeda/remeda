import type { IsUnknown } from "type-fest";
import type { GuardType } from "./internal/types/GuardType";

/**
 * A function that takes a guard function as predicate and returns a guard that negates it.
 *
 * @param predicate - The guard function to negate.
 * @returns Function A guard function.
 * @signature
 *    isNot(isTruthy)(data)
 * @example
 *    isNot(isTruthy)(false) //=> true
 *    isNot(isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
export function isNot<T extends (data: unknown) => data is unknown>(
  // Guards whose guarded type is `unknown` would make the `Exclude` below
  // collapse to `never`, so they are rejected here and handled by the next
  // signature instead. The rejection is spelled as a guard narrowing to `never`
  // (rather than as a bare `never`) so that this position stays function-shaped
  // and keeps mentioning `T`: against a bare `never` no candidate is inferred
  // for `T`, so every generic guard (`isString`, `isNullish`, ...) falls back
  // to the constraint, whose guarded type is `unknown`, and gets rejected too.
  predicate: IsUnknown<GuardType<T>> extends true
    ? (data: Parameters<T>[0]) => data is never
    : T,
): <Wide>(data: Wide) => data is Exclude<Wide, GuardType<T>>;

// Fallback for guards the signature above rejects: those whose guarded type is
// `unknown` (e.g. `isTruthy`), and those whose parameter is narrower than
// `unknown` (e.g. `startsWith`), which the constraint above can't accept.
export function isNot<T, Narrow extends T>(
  predicate: (data: T) => data is Narrow,
): (data: T) => data is Exclude<T, Narrow>;

// Fallback for trivial (non-narrowing) boolean predicates.
export function isNot<T>(predicate: (data: T) => boolean): (data: T) => boolean;

export function isNot<T>(
  predicate: (data: T) => boolean,
): (data: T) => boolean {
  return (data) => !predicate(data);
}
