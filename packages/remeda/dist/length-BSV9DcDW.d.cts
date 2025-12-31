//#region src/length.d.ts
type Enumerable<T> = ArrayLike<T> | Iterable<T>;
/**
 * Counts values of the collection or iterable.
 *
 * @param items - The input data.
 * @signature
 *    R.length(array)
 * @example
 *    R.length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
declare function length<T>(items: Enumerable<T>): number;
/**
 * Counts values of the collection or iterable.
 *
 * @signature
 *    R.length()(array)
 * @example
 *    R.pipe([1, 2, 3], R.length()) // => 3
 * @dataLast
 * @category Array
 */
declare function length<T>(): (items: Enumerable<T>) => number;
//#endregion
export { length as t };
//# sourceMappingURL=length-BSV9DcDW.d.cts.map