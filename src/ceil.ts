import { _round } from './_round';
import { purry } from './purry';

/**
 * Rounds up a given number to a specific precision.
 * @param value The number to round up.
 * @param precision The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(value, precision);
 * @example
 *    R.ceil(123.4317, 3) // => 123.432
 *    R.ceil(483.22243, 1) // => 483.3
 *    R.ceil(8541, -2) // => 8600
 * @dataFirst
 * @category Number
 */
export function ceil(value: number, precision: number): number;

/**
 * Rounds up a given number to a specific precision.
 * @param value The number to round up.
 * @param precision The precision to round up to. Must be an integer between -15 and 15.
 * @signature
 *    R.ceil(precision)(value);
 * @example
 *    R.ceil(3)(123.4317) // => 123.432
 *    R.ceil(1)(483.22243) // => 483.3
 *    R.ceil(-2)(8541) // => 8600
 * @dataLast
 * @category Number
 */
export function ceil(precision: number): (value: number) => number;

export function ceil() {
  return purry(_round(Math.ceil), arguments);
}
