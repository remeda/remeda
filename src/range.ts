import { purry } from './purry';

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param start the start number
 * @param end the end number
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @data_first
 * @category Array
 */
export function range(start: number, end: number): number[];

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param end the end number
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 * @data_first
 * @category Array
 */
export function range(end: number): (start: number) => number[];

export function range() {
  return purry(_range, arguments);
}

function _range(start: number, end: number) {
  const ret: number[] = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
