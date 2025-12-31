//#region src/add.d.ts
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
 * @dataFirst
 * @category Number
 */
declare function add(value: bigint, addend: bigint): bigint;
declare function add(value: number, addend: number): number;
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
declare function add(addend: bigint): (value: bigint) => bigint;
declare function add(addend: number): (value: number) => number;
//#endregion
export { add as t };
//# sourceMappingURL=add-D8hkMo5z.d.cts.map