import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";

//#region src/dropLast.d.ts

/**
 * Removes last `n` elements from the `array`.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(array, n)
 * @example
 *    R.dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
declare function dropLast<T extends IterableContainer>(array: T, n: number): Array<T[number]>;
/**
 * Removes last `n` elements from the `array`.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    R.dropLast(n)(array)
 * @example
 *    R.dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
declare function dropLast(n: number): <T extends IterableContainer>(array: T) => Array<T[number]>;
//#endregion
export { dropLast as t };
//# sourceMappingURL=dropLast-BAfXuNnz.d.ts.map