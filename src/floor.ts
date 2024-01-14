import { _round } from './_round';
import { purry } from './purry';

/**
 * Rounds down a given number to a specific precision.
 * @param value The number to round down.
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(value, precision);
 * @example
 *    R.floor(123.4317, 3) // => 123.431
 *    R.floor(483.22243, 1) // => 483.2
 *    R.floor(8541, -2) // => 8500
 * @dataFirst
 * @category Number
 */
export function floor(value: number, precision: number): number;

/**
 * Rounds down a given number to a specific precision.
 * @param value The number to round down.
 * @param precision The precision to round down to. Must be an integer between -15 and 15.
 * @signature
 *    R.floor(precision)(value);
 * @example
 *    R.floor(3)(123.4317) // => 123.431
 *    R.floor(1)(483.22243) // => 483.2
 *    R.floor(-2)(8541) // => 8500
 * @dataLast
 * @category Number
 */
export function floor(precision: number): (value: number) => number;

export function floor() {
  return purry(_round(Math.floor), arguments);
}
