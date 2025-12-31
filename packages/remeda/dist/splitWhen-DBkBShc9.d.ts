//#region src/splitWhen.d.ts
/**
 * Splits a given array at the first index where the given predicate returns true.
 *
 * @param data - The array to split.
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(array, fn)
 * @example
 *    R.splitWhen([1, 2, 3], x => x === 2) // => [[1], [2, 3]]
 * @dataFirst
 * @category Array
 */
declare function splitWhen<T>(data: ReadonlyArray<T>, predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean): [Array<T>, Array<T>];
/**
 * Splits a given array at an index where the given predicate returns true.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.splitWhen(fn)(array)
 * @example
 *    R.splitWhen(x => x === 2)([1, 2, 3]) // => [[1], [2, 3]]
 * @dataLast
 * @category Array
 */
declare function splitWhen<T>(predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean): (array: ReadonlyArray<T>) => [Array<T>, Array<T>];
//#endregion
export { splitWhen as t };
//# sourceMappingURL=splitWhen-DBkBShc9.d.ts.map