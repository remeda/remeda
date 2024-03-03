import { purry } from "./purry";

/**
 * Divides two numbers.
 * @param value The number.
 * @param divisor The number to divide the value by.
 * @signature
 *    R.divide(value, divisor);
 * @example
 *    R.divide(12, 3) // => 4
 *    R.reduce([1, 2, 3, 4], R.divide, 24) // => 1
 * @dataFirst
 * @category Number
 */
export function divide(value: number, divisor: number): number;

/**
 * Divides two numbers.
 * @param value The number.
 * @param divisor The number to divide the value by.
 * @signature
 *    R.divide(divisor)(value);
 * @example
 *    R.divide(3)(12) // => 4
 *    R.map([2, 4, 6, 8], R.divide(2)) // => [1, 2, 3, 4]
 * @dataLast
 * @category Number
 */
export function divide(divisor: number): (value: number) => number;

export function divide() {
  return purry(_divide, arguments);
}

function _divide(value: number, divisor: number) {
  return value / divisor;
}
