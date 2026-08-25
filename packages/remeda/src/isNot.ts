import type { IsUnknown } from "type-fest";
import type { GuardType } from "./internal/types/GuardType";
import type { IterableContainer } from "./internal/types/IterableContainer";

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
export function isNot<
  T extends (data: unknown, ...args: never) => data is unknown,
>(
  predicate: IsUnknown<GuardType<T>> extends true ? never : T,
): <Wide extends Parameters<T>[0]>(
  data: Wide,
) => data is Exclude<Wide, GuardType<T>>;

// Fallback for type-predicates which take a type parameter and resolve eagerly
// to undefined.
export function isNot<T, Rest extends IterableContainer, Narrow extends T>(
  predicate: (data: T, ...rest: Rest) => data is Narrow,
): (data: T, ...rest: Rest) => data is Exclude<T, Narrow>;

// Fallback for trivial (non-narrowing) boolean predicates.
export function isNot<T, Rest extends IterableContainer>(
  predicate: (data: T, ...rest: Rest) => boolean,
): (data: T, ...rest: Rest) => boolean;

export function isNot<T, Rest extends IterableContainer>(
  predicate: (data: T, ...rest: Rest) => boolean,
): (data: T, ...rest: Rest) => boolean {
  return (data, ...rest) => !predicate(data, ...rest);
}
