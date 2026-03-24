import { withPrecision } from "./internal/withPrecision";
import { purry } from "./purry";

/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round.
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    round(value, precision);
 * @example
 *    round(123.9876, 3) // => 123.988
 *    round(483.22243, 1) // => 483.2
 *    round(8541, -1) // => 8540
 *    round(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
export function round(value: number, precision: number): number;

/**
 * Rounds a given number to a specific precision.
 * If you'd like to round to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.round` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    round(precision)(value);
 * @example
 *    round(3)(123.9876) // => 123.988
 *    round(1)(483.22243) // => 483.2
 *    round(-1)(8541) // => 8540
 *    round(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
export function round(precision: number): (value: number) => number;

export function round(...args: readonly unknown[]): unknown {
  return purry(withPrecision(Math.round), args);
}
