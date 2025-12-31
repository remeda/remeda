import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as ArrayRequiredPrefix } from "./ArrayRequiredPrefix-BQgcBIkt.js";
import { IsNumericLiteral } from "type-fest";

//#region src/hasAtLeast.d.ts

/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param data - The input array.
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
declare function hasAtLeast<T extends IterableContainer, N extends number>(data: IterableContainer | T, minimum: IsNumericLiteral<N> extends true ? N : never): data is ArrayRequiredPrefix<T, N>;
declare function hasAtLeast(data: IterableContainer, minimum: number): boolean;
/**
 * Checks if the given array has at least the defined number of elements. When
 * the minimum used is a literal (e.g. `3`) the output is refined accordingly so
 * that those indices are defined when accessing the array even when using
 * typescript's 'noUncheckedIndexAccess'.
 *
 * @param minimum - The minimum number of elements the array must have.
 * @returns True if the array's length is *at least* `minimum`. When `minimum`
 * is a literal value, the output is narrowed to ensure the first items are
 * guaranteed.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
declare function hasAtLeast<N extends number>(minimum: IsNumericLiteral<N> extends true ? N : never): <T extends IterableContainer>(data: IterableContainer | T) => data is ArrayRequiredPrefix<T, N>;
declare function hasAtLeast(minimum: number): (data: IterableContainer) => boolean;
//#endregion
export { hasAtLeast as t };
//# sourceMappingURL=hasAtLeast-C1bQldG9.d.ts.map