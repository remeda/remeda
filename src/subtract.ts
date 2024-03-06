import { purry } from "./purry";

/**
 * Subtracts two numbers.
 * @param value - The number.
 * @param subtrahend - The number to subtract from the value.
 * @signature
 *    R.subtract(value, subtrahend);
 * @example
 *    R.subtract(10, 5) // => 5
 *    R.subtract(10, -5) // => 15
 *    R.reduce([1, 2, 3, 4], R.subtract, 20) // => 10
 * @dataFirst
 * @category Number
 */
export function subtract(value: number, subtrahend: number): number;

/**
 * Subtracts two numbers.
 * @param value - The number.
 * @param subtrahend - The number to subtract from the value.
 * @signature
 *    R.subtract(subtrahend)(value);
 * @example
 *    R.subtract(5)(10) // => 5
 *    R.subtract(-5)(10) // => 15
 *    R.map([1, 2, 3, 4], R.subtract(1)) // => [0, 1, 2, 3]
 * @dataLast
 * @category Number
 */
export function subtract(subtrahend: number): (value: number) => number;

export function subtract() {
  return purry(_subtract, arguments);
}

function _subtract(value: number, subtrahend: number) {
  return value - subtrahend;
}
