import { _withPrecision } from './_withPrecision';
import { purry } from './purry';

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 * @param value The number to round down.
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(value, precision);
 * @example
 *    R.floor(123.9876, 3) // => 123.987
 *    R.floor(483.22243, 1) // => 483.2
 *    R.floor(8541, -1) // => 8540
 *    R.floor(456789, -3) // => 456000
 * @dataFirst
 * @category Number
 */
export function floor(value: number, precision: number): number;

/**
 * Rounds down a given number to a specific precision.
 * If you'd like to round down to an integer (i.e. use this function with constant `precision === 0`),
 * use `Math.floor` instead, as it won't incur the additional library overhead.
 * @param value The number to round down.
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(precision)(value);
 * @example
 *    R.floor(3)(123.9876) // => 123.987
 *    R.floor(1)(483.22243) // => 483.2
 *    R.floor(-1)(8541) // => 8540
 *    R.floor(-3)(456789) // => 456000
 * @dataLast
 * @category Number
 */
export function floor(precision: number): (value: number) => number;

export function floor() {
  return purry(_withPrecision(Math.floor), arguments);
}
