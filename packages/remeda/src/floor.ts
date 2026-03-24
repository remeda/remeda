import { withPrecision } from "./internal/withPrecision";
import { purry } from "./purry";

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param value - The number to round down.
 * @param precision - The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    floor(value, precision);
 * @example
 *    floor(123.9876, 3) // => 123.987
 *    floor(483.22243, 1) // => 483.2
 *    floor(8541, -1) // => 8540
 *    floor(456789, -3) // => 456000
 * @dataFirst
 * @category Number
 */
export function floor(value: number, precision: number): number;

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 *
 * @param precision - The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    floor(precision)(value);
 * @example
 *    floor(3)(123.9876) // => 123.987
 *    floor(1)(483.22243) // => 483.2
 *    floor(-1)(8541) // => 8540
 *    floor(-3)(456789) // => 456000
 * @dataLast
 * @category Number
 */
export function floor(precision: number): (value: number) => number;

export function floor(...args: readonly unknown[]): unknown {
  return purry(withPrecision(Math.floor), args);
}
