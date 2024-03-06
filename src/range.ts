import { purry } from "./purry";

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param start - The start number.
 * @param end - The end number.
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(start: number, end: number): Array<number>;

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 * @param end - The end number.
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(end: number): (start: number) => Array<number>;

export function range() {
  return purry(_range, arguments);
}

function _range(start: number, end: number) {
  const ret: Array<number> = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
