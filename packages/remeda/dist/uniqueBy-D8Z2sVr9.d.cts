import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as Deduped } from "./Deduped-Fp4NAzjC.cjs";

//#region src/uniqueBy.d.ts

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(data, keyFunction)
 * @example
 *    R.uniqueBy(
 *     [{ n: 1 }, { n: 2 }, { n: 2 }, { n: 5 }, { n: 1 }, { n: 6 }, { n: 7 }],
 *     (obj) => obj.n,
 *    ) // => [{n: 1}, {n: 2}, {n: 5}, {n: 6}, {n: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function uniqueBy<T extends IterableContainer>(data: T, keyFunction: (item: T[number], index: number, data: T) => unknown): Deduped<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function. Elements are compared by reference using Set.
 *
 * @param keyFunction - Extracts a value that would be used to compare elements.
 * @signature
 *    R.uniqueBy(keyFunction)(data)
 * @example
 *    R.pipe(
 *      [{n: 1}, {n: 2}, {n: 2}, {n: 5}, {n: 1}, {n: 6}, {n: 7}], // only 4 iterations
 *      R.uniqueBy(obj => obj.n),
 *      R.take(3)
 *    ) // => [{n: 1}, {n: 2}, {n: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function uniqueBy<T extends IterableContainer>(keyFunction: (item: T[number], index: number, data: T) => unknown): (data: T) => Deduped<T>;
//#endregion
export { uniqueBy as t };
//# sourceMappingURL=uniqueBy-D8Z2sVr9.d.cts.map