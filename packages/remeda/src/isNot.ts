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
  predicate: IsUnknown<GuardType<T>> extends true ? never : T,
): <Wide extends Parameters<T>[0]>(
  data: Wide,
) => data is Exclude<Wide, GuardType<T>>;

// Fallback for type-predicates which take a type parameter and resolves eagerly
// to `unknown`.
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
