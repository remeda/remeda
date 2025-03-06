import { isArray } from "./isArray";
import { purry } from "./purry";

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    R.allPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(12, fns) // => true
 *    R.allPass(8, fns) // => false
 * @dataFirst
 * @lazy
 * @category Array
 */
export function allPass<T>(
  data: T,
  fns: Iterable<(data: T) => boolean>,
): boolean;

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    R.allPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(fns)(12) // => true
 *    R.allPass(fns)(8) // => false
 * @dataLast
 * @lazy
 * @category Array
 */
export function allPass<T>(
  fns: Iterable<(data: T) => boolean>,
): (data: T) => boolean;

export function allPass(...args: ReadonlyArray<unknown>): unknown {
  return purry(allPassImplementation, args);
}

function allPassImplementation<T>(
  data: T,
  fns: Iterable<(data: T) => boolean>,
): boolean {
  if (isArray(fns)) {
    return fns.every((fn) => fn(data));
  }
  for (const fn of fns) {
    if (!fn(data)) {
      return false;
    }
  }
  return true;
}
