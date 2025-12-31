import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as ReorderedArray } from "./ReorderedArray-BUZ1Pbmy.js";

//#region src/sort.d.ts

/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param items - The array to sort.
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(items, cmp)
 * @example
 *    R.sort([4, 2, 7, 5], (a, b) => a - b); // => [2, 4, 5, 7]
 * @dataFirst
 * @category Array
 */
declare function sort<T extends IterableContainer>(items: T, cmp: (a: T[number], b: T[number]) => number): ReorderedArray<T>;
/**
 * Sorts an array. The comparator function should accept two values at a time
 * and return a negative number if the first value is smaller, a positive number
 * if it's larger, and zero if they are equal. Sorting is based on a native
 * `sort` function.
 *
 * @param cmp - The comparator function.
 * @signature
 *    R.sort(cmp)(items)
 * @example
 *    R.pipe([4, 2, 7, 5], R.sort((a, b) => a - b)) // => [2, 4, 5, 7]
 * @dataLast
 * @category Array
 */
declare function sort<T extends IterableContainer>(cmp: (a: T[number], b: T[number]) => number): (items: T) => ReorderedArray<T>;
//#endregion
export { sort as t };
//# sourceMappingURL=sort-CCgPUFYf.d.ts.map