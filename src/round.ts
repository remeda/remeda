import { _round } from './_round';
import { purry } from './purry';

/**
 * Rounds a given number to a specific precision.
 * @param value The number to round.
 * @param precision The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(value, precision);
 * @example
 *    R.round(123.4317, 3) // => 123.432
 *    R.round(483.22243, 1) // => 483.2
 *    R.round(8541, -2) // => 8500
 * @dataFirst
 * @category Number
 */
export function round(value: number, precision: number): number;

/**
 * Rounds a given number to a specific precision.
 * @param value The number to round.
 * @param precision The precision to round to. Must be an integer between -15 and 15.
 * @signature
 *    R.round(precision)(value);
 * @example
 *    R.round(3)(123.4317) // => 123.432
 *    R.round(1)(483.22243) // => 483.2
 *    R.round(-2)(8541) // => 8500
 * @dataLast
 * @category Number
 */
export function round(precision: number): (value: number) => number;

export function round() {
  return purry(_round(Math.round), arguments);
}
