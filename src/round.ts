import { _withPrecision } from "./_withPrecision";
import { purry } from "./purry";

/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 * @param value - The number to round.
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(value, precision);
 * @example
 *    R.round(123.9876, 3) // => 123.988
 *    R.round(483.22243, 1) // => 483.2
 *    R.round(8541, -1) // => 8540
 *    R.round(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
export function round(value: number, precision: number): number;

/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 * @param value - The number to round.
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(precision)(value);
 * @example
 *    R.round(3)(123.9876) // => 123.988
 *    R.round(1)(483.22243) // => 483.2
 *    R.round(-1)(8541) // => 8540
 *    R.round(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
export function round(precision: number): (value: number) => number;

export function round() {
  return purry(_withPrecision(Math.round), arguments);
}
