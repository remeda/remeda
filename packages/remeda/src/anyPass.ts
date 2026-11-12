/* eslint-disable unicorn/consistent-boolean-name --
 * TODO [>2] -- This rule is on-point! The function's name should communicate
 * more clearly that it returns a boolean value.
 */

import { purry2 } from "./internal/purryByArity";

type Predicate<T = unknown> = (data: T) => boolean;

/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    anyPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    anyPass(8, fns) // => true
 *    anyPass(11, fns) // => false
 * @dataFirst
 * @category Array
 */
export function anyPass<T>(data: T, fns: readonly Predicate<T>[]): boolean;

/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    anyPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    anyPass(fns)(8) // => true
 *    anyPass(fns)(11) // => false
 * @dataLast
 * @category Array
 */
export function anyPass<T>(fns: readonly Predicate<T>[]): (data: T) => boolean;

export function anyPass(
  dataOrFns: unknown,
  fns?: readonly Predicate[],
): unknown {
  return purry2(anyPassImplementation, arguments.length, dataOrFns, fns);
}

const anyPassImplementation = <T>(
  data: T,
  fns: readonly ((data: T) => boolean)[],
): boolean => fns.some((fn) => fn(data));
