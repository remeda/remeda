import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/dropWhile.d.ts

/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(data, predicate)
 * @example
 *    R.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function dropWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
declare function dropWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (data: T) => Array<T[number]>;
//#endregion
export { dropWhile as t };
//# sourceMappingURL=dropWhile-DxxCykWU.d.cts.map