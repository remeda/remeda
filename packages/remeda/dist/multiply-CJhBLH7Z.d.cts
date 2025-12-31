//#region src/multiply.d.ts
/**
 * Multiplies two numbers.
 *
 * @param value - The number.
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    R.multiply(value, multiplicand);
 * @example
 *    R.multiply(3, 4) // => 12
 *    R.reduce([1, 2, 3, 4], R.multiply, 1) // => 24
 * @dataFirst
 * @category Number
 */
declare function multiply(value: bigint, multiplicand: bigint): bigint;
declare function multiply(value: number, multiplicand: number): number;
/**
 * Multiplies two numbers.
 *
 * @param multiplicand - The number to multiply the value by.
 * @signature
 *    R.multiply(multiplicand)(value);
 * @example
 *    R.multiply(4)(3) // => 12
 *    R.map([1, 2, 3, 4], R.multiply(2)) // => [2, 4, 6, 8]
 * @dataLast
 * @category Number
 */
declare function multiply(multiplicand: bigint): (value: bigint) => bigint;
declare function multiply(multiplicand: number): (value: number) => number;
//#endregion
export { multiply as t };
//# sourceMappingURL=multiply-CJhBLH7Z.d.cts.map