import { purry } from "./purry";

/**
 * Adds two numbers.
 *
 * @copyDoc
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
export function add(value: bigint, addend: bigint): bigint;
/** @pasteDoc */
export function add(value: number, addend: number): number;

/**
 * @pasteDoc
 * @signature
 *    R.add(addend)(value);
 * @dataLast
 */
export function add(addend: bigint): (value: bigint) => bigint;
/**
 * @pasteDoc
 * @signature
 *    R.add(addend)(value);
 * @dataLast
 */
export function add(addend: number): (value: number) => number;

export function add(...args: ReadonlyArray<unknown>): unknown {
  return purry(addImplementation, args);
}

// The implementation only uses `number` types, but that's just because it's
// hard to tell typescript that both value and addend would be of the same type.
const addImplementation = (value: number, addend: number): number =>
  value + addend;
