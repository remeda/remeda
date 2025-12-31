import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as FilteredArray } from "./FilteredArray-Ci4z7F_Y.cjs";
import { Writable } from "type-fest";

//#region src/filter.d.ts
type NonRefinedFilteredArray<T extends IterableContainer, IsItemIncluded extends boolean> = boolean extends IsItemIncluded ? Array<T[number]> : IsItemIncluded extends true ? Writable<T> : [];
/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param data - The array to filter.
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise. A type-predicate can also be used to narrow the result.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(data, predicate)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function filter<T extends IterableContainer, Condition extends T[number]>(data: T, predicate: (value: T[number], index: number, data: T) => value is Condition): FilteredArray<T, Condition>;
declare function filter<T extends IterableContainer, IsItemIncluded extends boolean>(data: T, predicate: (value: T[number], index: number, data: T) => IsItemIncluded): NonRefinedFilteredArray<T, IsItemIncluded>;
/**
 * Creates a shallow copy of a portion of a given array, filtered down to just
 * the elements from the given array that pass the test implemented by the
 * provided function. Equivalent to `Array.prototype.filter`.
 *
 * @param predicate - A function to execute for each element in the array. It
 * should return `true` to keep the element in the resulting array, and `false`
 * otherwise.
 * @returns A shallow copy of the given array containing just the elements that
 * pass the test. If no elements pass the test, an empty array is returned.
 * @signature
 *    R.filter(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3], R.filter(x => x % 2 === 1)) // => [1, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function filter<T extends IterableContainer, Condition extends T[number]>(predicate: (value: T[number], index: number, data: T) => value is Condition): (data: T) => FilteredArray<T, Condition>;
declare function filter<T extends IterableContainer, IsItemIncluded extends boolean>(predicate: (value: T[number], index: number, data: T) => IsItemIncluded): (data: T) => NonRefinedFilteredArray<T, IsItemIncluded>;
//#endregion
export { filter as t };
//# sourceMappingURL=filter-B95f5Hcp.d.cts.map