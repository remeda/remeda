import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/sum.d.ts
type Sum<T extends IterableContainer<bigint> | IterableContainer<number>> = T extends readonly [] ? 0 : T extends readonly [bigint, ...ReadonlyArray<unknown>] ? bigint : T[number] extends bigint ? bigint | 0 : number;
/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty` to guard against this case.
 *
 * @param data - The array of numbers.
 * @signature
 *   R.sum(data);
 * @example
 *   R.sum([1, 2, 3]); // => 6
 *   R.sum([1n, 2n, 3n]); // => 6n
 *   R.sum([]); // => 0
 * @dataFirst
 * @category Number
 */
declare function sum<T extends IterableContainer<bigint> | IterableContainer<number>>(data: T): Sum<T>;
/**
 * Sums the numbers in the array, or return 0 for an empty array.
 *
 * Works for both `number` and `bigint` arrays, but not arrays that contain both
 * types.
 *
 * IMPORTANT: The result for empty arrays would be 0 (`number`) regardless of
 * the type of the array; to avoid adding this to the return type for cases
 * where the array is known to be non-empty you can use `hasAtLeast` or
 * `isEmpty`to guard against this case.
 *
 * @signature
 *   R.sum()(data);
 * @example
 *   R.pipe([1, 2, 3], R.sum()); // => 6
 *   R.pipe([1n, 2n, 3n], R.sum()); // => 6n
 *   R.pipe([], R.sum()); // => 0
 * @dataLast
 * @category Number
 */
declare function sum(): <T extends IterableContainer<bigint> | IterableContainer<number>>(data: T) => Sum<T>;
//#endregion
export { sum as t };
//# sourceMappingURL=sum-B5Zexogk.d.cts.map