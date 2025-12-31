import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as Mapped } from "./Mapped-C_qR6J2B.cjs";

//#region src/mapWithFeedback.d.ts

/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param data - The array to map over.
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(data, callbackfn, initialValue);
 * @example
 *    R.mapWithFeedback(
 *      [1, 2, 3, 4, 5],
 *      (prev, x) => prev + x,
 *      100,
 *    ); // => [101, 103, 106, 110, 115]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function mapWithFeedback<T extends IterableContainer, U>(data: T, callbackfn: (previousValue: U, currentValue: T[number], currentIndex: number, data: T) => U, initialValue: U): Mapped<T, U>;
/**
 * Applies a function on each element of the array, using the result of the
 * previous application, and returns an array of the successively computed
 * values.
 *
 * @param callbackfn - The callback function that receives the previous value,
 * the current element.
 * @param initialValue - The initial value to start the computation with.
 * @returns An array of successively computed values from the left side of the
 * array.
 * @signature
 *    R.mapWithFeedback(callbackfn, initialValue)(data);
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4, 5],
 *      R.mapWithFeedback((prev, x) => prev + x, 100),
 *    ); // => [101, 103, 106, 110, 115]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function mapWithFeedback<T extends IterableContainer, U>(callbackfn: (previousValue: U, currentValue: T[number], currentIndex: number, data: T) => U, initialValue: U): (data: T) => Mapped<T, U>;
//#endregion
export { mapWithFeedback as t };
//# sourceMappingURL=mapWithFeedback-4F1UQUaR.d.cts.map