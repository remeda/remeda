import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";

//#region src/concat.d.ts

/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param data - The first items, these would be at the beginning of the new
 * array.
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(data, other);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @category Array
 */
declare function concat<T1 extends IterableContainer, T2 extends IterableContainer>(data: T1, other: T2): [...T1, ...T2];
/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @category Array
 */
declare function concat<T2 extends IterableContainer>(other: T2): <T1 extends IterableContainer>(data: T1) => [...T1, ...T2];
//#endregion
export { concat as t };
//# sourceMappingURL=concat-BNHNILc7.d.ts.map