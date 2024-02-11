import { purry } from './purry';

/**
 * Multiplies two numbers.
 * @param value The number.
 * @param multiplicand The number to multiply the value by.
 * @signature
 *    R.multiply(value, multiplicand);
 * @example
 *    R.multiply(3, 4) // => 12
 *    R.reduce([1, 2, 3, 4], R.multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
export function multiply(value: number, multiplicand: number): number;

/**
 * Multiplies two numbers.
 * @param value The number.
 * @param multiplicand The number to multiply the value by.
 * @signature
 *    R.multiply(multiplicand)(value);
 * @example
 *    R.multiply(4)(3) // => 12
 *    R.map([1, 2, 3, 4], R.multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
export function multiply(multiplicand: number): (value: number) => number;

export function multiply() {
  return purry(_multiply, arguments);
}

function _multiply(value: number, multiplicand: number) {
  return value * multiplicand;
}
