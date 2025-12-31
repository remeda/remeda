//#region src/range.d.ts
/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param start - The start number.
 * @param end - The end number.
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function range(start: number, end: number): Array<number>;
/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param end - The end number.
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
declare function range(end: number): (start: number) => Array<number>;
//#endregion
export { range as t };
//# sourceMappingURL=range-Dd-SvnNo.d.cts.map