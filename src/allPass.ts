import { purry } from './purry';

/**
 * Determines whether all predicates returns true for the input data.
 * @param data The input data for predicates.
 * @param fns The list of predicates.
 * @signature
 *    R.allPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(12, fns) // => true
 *    R.allPass(8, fns) // => false
 * @data_first
 * @category Array
 */
export function allPass<T>(
  data: T,
  fns: ReadonlyArray<(data: T) => boolean>
): boolean;

/**
 * Determines whether all predicates returns true for the input data.
 * @param fns The list of predicates.
 * @signature
 *    R.allPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.allPass(fns)(12) // => true
 *    R.allPass(fns)(8) // => false
 * @data_last
 * @category Array
 */
export function allPass<T>(
  fns: ReadonlyArray<(data: T) => boolean>
): (data: T) => boolean;

export function allPass() {
  return purry(_allPass, arguments);
}

function _allPass(data: any, fns: Array<(data: any) => boolean>) {
  return fns.every(fn => fn(data));
}
