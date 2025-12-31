import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as ReorderedArray } from "./ReorderedArray-BUZ1Pbmy.js";

//#region src/shuffle.d.ts

/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @param items - The array to shuffle.
 * @signature
 *    R.shuffle(array)
 * @example
 *    R.shuffle([4, 2, 7, 5]) // => [7, 5, 4, 2]
 * @dataFirst
 * @category Array
 */
declare function shuffle<T extends IterableContainer>(items: T): ReorderedArray<T>;
/**
 * Shuffles the input array, returning a new array with the same elements in a random order.
 *
 * @signature
 *    R.shuffle()(array)
 * @example
 *    R.pipe([4, 2, 7, 5], R.shuffle()) // => [7, 5, 4, 2]
 * @dataLast
 * @category Array
 */
declare function shuffle(): <T extends IterableContainer>(items: T) => ReorderedArray<T>;
//#endregion
export { shuffle as t };
//# sourceMappingURL=shuffle-Dem4LHuf.d.ts.map