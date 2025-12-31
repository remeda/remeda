import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { LastArrayElement } from "type-fest";

//#region src/last.d.ts
type Last<T extends IterableContainer> = LastArrayElement<T, T extends readonly [] ? never : undefined>;
/**
 * Gets the last element of `array`.
 *
 * @param data - The array.
 * @signature
 *    R.last(array)
 * @example
 *    R.last([1, 2, 3]) // => 3
 *    R.last([]) // => undefined
 * @dataFirst
 * @category Array
 */
declare function last<T extends IterableContainer>(data: T): Last<T>;
/**
 * Gets the last element of `array`.
 *
 * @signature
 *    R.last()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.last(),
 *      x => x + 1
 *    ); // => 17
 * @dataLast
 * @category Array
 */
declare function last(): <T extends IterableContainer>(data: T) => Last<T>;
//#endregion
export { last as t };
//# sourceMappingURL=last-BRXyy3M-.d.ts.map