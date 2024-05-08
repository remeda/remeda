import { purry } from "./purry";

/**
 * Subtracts two numbers.
 *
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
export function subtract(value: bigint, subtrahend: bigint): bigint;
export function subtract(value: number, subtrahend: number): number;

/**
 * Subtracts two numbers.
 *
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
export function subtract(subtrahend: bigint): (value: bigint) => bigint;
export function subtract(subtrahend: number): (value: number) => number;

export function subtract(...args: ReadonlyArray<unknown>): unknown {
  return purry(subtractImplementation, args);
}

// The implementation only uses `number` types, but that's just because it's
// hard to tell typescript that both value and subtrahend would be of the same
// type.
const subtractImplementation = (value: number, subtrahend: number): number =>
  value - subtrahend;
