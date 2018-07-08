import { purry } from './purry';

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.reject(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 * @data_first
 * @category Array
 */
export function reject<T>(items: T[], fn: (input: T) => boolean): T[];

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.reject(array, fn)
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 0) // => [1, 3]
 * @data_first
 * @category Array
 */
export function reject<T>(fn: (input: T) => boolean): (items: T[]) => T[];

export function reject() {
  return purry(_reject, arguments);
}

function _reject<T>(items: T[], fn: (input: T) => boolean) {
  return items.filter(item => !fn(item));
}
