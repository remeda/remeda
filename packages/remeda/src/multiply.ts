import { purry } from "./purry";

/**
 * Multiplies two numbers.
 *
 * @param value - The number.
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    multiply(value, multiplicand);
 * @example
 *    multiply(3, 4) // => 12
 *    reduce([1, 2, 3, 4], multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
export function multiply(value: bigint, multiplicand: bigint): bigint;
export function multiply(value: number, multiplicand: number): number;

/**
 * Multiplies two numbers.
 *
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    multiply(multiplicand)(value);
 * @example
 *    multiply(4)(3) // => 12
 *    map([1, 2, 3, 4], multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
export function multiply(multiplicand: bigint): (value: bigint) => bigint;
export function multiply(multiplicand: number): (value: number) => number;

export function multiply(...args: readonly unknown[]): unknown {
  return purry(multiplyImplementation, args);
}

// The implementation only uses `number` types, but that's just because it's
// hard to tell typescript that both value and multiplicand would be of the same
// type.
const multiplyImplementation = (value: number, multiplicand: number): number =>
  value * multiplicand;
