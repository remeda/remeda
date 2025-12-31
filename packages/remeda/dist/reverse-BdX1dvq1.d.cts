//#region src/reverse.d.ts
type Reverse<T extends ReadonlyArray<unknown>, R extends ReadonlyArray<unknown> = []> = ReturnType<T extends IsNoTuple<T> ? () => [...T, ...R] : T extends readonly [infer F, ...infer L] ? () => Reverse<L, [F, ...R]> : () => R>;
type IsNoTuple<T> = T extends readonly [unknown, ...Array<unknown>] ? never : T;
/**
 * Reverses array.
 *
 * @param array - The array.
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
declare function reverse<T extends ReadonlyArray<unknown>>(array: T): Reverse<T>;
/**
 * Reverses array.
 *
 * @signature
 *    R.reverse()(array);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
declare function reverse<T extends ReadonlyArray<unknown>>(): (array: T) => Reverse<T>;
//#endregion
export { reverse as t };
//# sourceMappingURL=reverse-BdX1dvq1.d.cts.map