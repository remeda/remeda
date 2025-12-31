import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/takeLastWhile.d.ts

/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(data, predicate)
 * @example
 *    R.takeLastWhile([1, 2, 10, 3, 4, 5], x => x < 10) // => [3, 4, 5]
 * @dataFirst
 * @category Array
 */
declare function takeLastWhile<T extends IterableContainer, S extends T[number]>(data: T, predicate: (item: T[number], index: number, data: T) => item is S): Array<S>;
declare function takeLastWhile<T extends IterableContainer>(data: T, predicate: (item: T[number], index: number, data: T) => boolean): Array<T[number]>;
/**
 * Returns elements from the end of the array until the predicate returns false.
 * The returned elements will be in the same order as in the original array.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeLastWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4, 5], R.takeLastWhile(x => x < 10))  // => [3, 4, 5]
 * @dataLast
 * @category Array
 */
declare function takeLastWhile<T extends IterableContainer, S extends T[number]>(predicate: (item: T[number], index: number, data: T) => item is S): (array: T) => Array<S>;
declare function takeLastWhile<T extends IterableContainer>(predicate: (item: T[number], index: number, data: T) => boolean): (data: T) => Array<T[number]>;
//#endregion
export { takeLastWhile as t };
//# sourceMappingURL=takeLastWhile-YlT1JJb_.d.cts.map