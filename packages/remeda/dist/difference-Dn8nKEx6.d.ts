//#region src/difference.d.ts
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    R.difference(data, other)
 * @example
 *    R.difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    R.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function difference<T>(data: ReadonlyArray<T>, other: ReadonlyArray<T>): Array<T>;
/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param other - The values to exclude.
 * @signature
 *    R.difference(other)(data)
 * @example
 *    R.pipe([1, 2, 3, 4], R.difference([2, 5, 3])); // => [1, 4]
 *    R.pipe([1, 1, 2, 2], R.difference([1])); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function difference<T>(other: ReadonlyArray<T>): (data: ReadonlyArray<T>) => Array<T>;
//#endregion
export { difference as t };
//# sourceMappingURL=difference-Dn8nKEx6.d.ts.map