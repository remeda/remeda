import { purry } from "./purry";

/**
 * Adds two numbers.
 *
 * @param value - The number.
 * @param addend - The number to add to the value.
 * @signature
 *    R.add(value, addend);
 * @example
 *    R.add(10, 5) // => 15
 *    R.add(10, -5) // => 5
 *    R.reduce([1, 2, 3, 4], R.add, 0) // => 10
 * @dataFirst
 * @category Number
 */
export function add(value: number, addend: number): number;

/**
 * Adds two numbers.
 *
 * @param addend - The number to add to the value.
 * @signature
 *    R.add(addend)(value);
 * @example
 *    R.add(5)(10) // => 15
 *    R.add(-5)(10) // => 5
 *    R.map([1, 2, 3, 4], R.add(1)) // => [2, 3, 4, 5]
 * @dataLast
 * @category Number
 */
export function add(addend: number): (value: number) => number;

export function add(...args: ReadonlyArray<unknown>): unknown {
  return purry(_add, args);
}

function _add(value: number, addend: number): number {
  return value + addend;
}
