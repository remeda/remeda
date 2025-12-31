//#region src/meanBy.d.ts
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(fn)(array)
 * @example
 *    R.pipe(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      R.meanBy(x => x.a)
 *    ) // 3
 * @dataLast
 * @category Array
 */
declare function meanBy<T>(fn: (value: T, index: number, data: ReadonlyArray<T>) => number): (items: ReadonlyArray<T>) => number;
/**
 * Returns the mean of the elements of an array using the provided predicate.
 *
 * @param items - The array.
 * @param fn - Predicate function.
 * @signature
 *   R.meanBy(array, fn)
 * @example
 *    R.meanBy(
 *      [{a: 5}, {a: 1}, {a: 3}],
 *      x => x.a
 *    ) // 3
 * @dataFirst
 * @category Array
 */
declare function meanBy<T>(items: ReadonlyArray<T>, fn: (value: T, index: number, data: ReadonlyArray<T>) => number): number;
//#endregion
export { meanBy as t };
//# sourceMappingURL=meanBy-Cn_tT6pN.d.cts.map