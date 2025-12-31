import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/take.d.ts

/**
 * Returns the first `n` elements of `array`.
 *
 * @param array - The array.
 * @param n - The number of elements to take.
 * @signature
 *    R.take(array, n)
 * @example
 *    R.take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function take<T extends IterableContainer>(array: T, n: number): Array<T[number]>;
/**
 * Returns the first `n` elements of `array`.
 *
 * @param n - The number of elements to take.
 * @signature
 *    R.take(n)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.take(n)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function take(n: number): <T extends IterableContainer>(array: T) => Array<T[number]>;
//#endregion
export { take as t };
//# sourceMappingURL=take-DfJodeK2.d.cts.map