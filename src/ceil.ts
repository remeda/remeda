import { _withPrecision } from "./_withPrecision";
import { purry } from "./purry";

/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 * @param value - The number to round up.
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(value, precision);
 * @example
 *    R.ceil(123.9876, 3) // => 123.988
 *    R.ceil(483.22243, 1) // => 483.3
 *    R.ceil(8541, -1) // => 8550
 *    R.ceil(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
export function ceil(value: number, precision: number): number;

/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 * @param value - The number to round up.
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(precision)(value);
 * @example
 *    R.ceil(3)(123.9876) // => 123.988
 *    R.ceil(1)(483.22243) // => 483.3
 *    R.ceil(-1)(8541) // => 8550
 *    R.ceil(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
export function ceil(precision: number): (value: number) => number;

export function ceil(): unknown {
  return purry(_withPrecision(Math.ceil), arguments);
}
