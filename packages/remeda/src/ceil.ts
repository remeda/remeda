import { withPrecision } from "./internal/withPrecision";
import { purry } from "./purry";

/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round up.
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    ceil(value, precision);
 * @example
 *    ceil(123.9876, 3) // => 123.988
 *    ceil(483.22243, 1) // => 483.3
 *    ceil(8541, -1) // => 8550
 *    ceil(456789, -3) // => 457000
 * @dataFirst
 * @category Number
 */
export function ceil(value: number, precision: number): number;

/**
 * Rounds up a given number to a specific precision.
 * If you'd like to round up to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.ceil` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    ceil(precision)(value);
 * @example
 *    ceil(3)(123.9876) // => 123.988
 *    ceil(1)(483.22243) // => 483.3
 *    ceil(-1)(8541) // => 8550
 *    ceil(-3)(456789) // => 457000
 * @dataLast
 * @category Number
 */
export function ceil(precision: number): (value: number) => number;

export function ceil(...args: readonly unknown[]): unknown {
  return purry(withPrecision(Math.ceil), args);
}
