import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as Deduped } from "./Deduped-Fp4NAzjC.cjs";

//#region src/unique.d.ts

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @param data - The array to filter.
 * @signature
 *    R.unique(array)
 * @example
 *    R.unique([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @dataFirst
 * @lazy
 * @category Array
 */
declare function unique<T extends IterableContainer>(data: T): Deduped<T>;
/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by reference using Set.
 *
 * @signature
 *    R.unique()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.unique(),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @dataLast
 * @lazy
 * @category Array
 */
declare function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;
//#endregion
export { unique as t };
//# sourceMappingURL=unique-Cz8M-Cet.d.cts.map