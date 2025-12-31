import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as NonEmptyArray } from "./NonEmptyArray-BsrhmvOn.js";

//#region src/internal/types/Deduped.d.ts

/**
 * The result of running a function that would dedupe an array (`unique`,
 * `uniqueBy`, and `uniqueWith`).
 *
 * There are certain traits of the output which are unique to a deduped array
 * that allow us to create a better type; see comments inline.
 *
 * !Note: We can build better types for each of the unique functions
 * _separately_ by taking advantage of _other_ characteristics that are unique
 * to each one (e.g. in `unique` we know that each item that has a disjoint type
 * to all previous items would be part of the output, even when it isn't the
 * first), but to make this utility the most useful we kept it simple and
 * generic for now.
 */
type Deduped<T extends IterableContainer> = T extends readonly [] ? [] : T extends readonly [infer Head, ...infer Rest] ? [Head, ...Array<Rest[number]>] : T extends readonly [...Array<unknown>, unknown] ? NonEmptyArray<T[number]> : Array<T[number]>;
//#endregion
export { Deduped as t };
//# sourceMappingURL=Deduped-iQNjN_DZ.d.ts.map