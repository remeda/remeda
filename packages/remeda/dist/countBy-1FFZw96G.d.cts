import { t as BoundedPartial } from "./BoundedPartial-DK52vzaV.cjs";

//#region src/countBy.d.ts

/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param data - The array.
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(data, categorizationFn)
 * @example
 *    R.countBy(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.toLowerCase()
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataFirst
 * @category Array
 */
declare function countBy<T, K extends PropertyKey>(data: ReadonlyArray<T>, categorizationFn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined): BoundedPartial<Record<K, number>>;
/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(categorizationFn)(data)
 * @example
 *    R.pipe(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.countBy(R.toLowerCase()),
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataLast
 * @category Array
 */
declare function countBy<T, K extends PropertyKey>(categorizationFn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined): (data: ReadonlyArray<T>) => BoundedPartial<Record<K, number>>;
//#endregion
export { countBy as t };
//# sourceMappingURL=countBy-1FFZw96G.d.cts.map