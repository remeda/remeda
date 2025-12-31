//#region src/anyPass.d.ts
/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    R.anyPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.anyPass(8, fns) // => true
 *    R.anyPass(11, fns) // => false
 * @dataFirst
 * @category Array
 */
declare function anyPass<T>(data: T, fns: ReadonlyArray<(data: T) => boolean>): boolean;
/**
 * Determines whether any predicate returns true for the input data.
 *
 * @param fns - The list of predicates.
 * @signature
 *    R.anyPass(fns)(data)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    R.anyPass(fns)(8) // => true
 *    R.anyPass(fns)(11) // => false
 * @dataLast
 * @category Array
 */
declare function anyPass<T>(fns: ReadonlyArray<(data: T) => boolean>): (data: T) => boolean;
//#endregion
export { anyPass as t };
//# sourceMappingURL=anyPass-D48uBuOZ.d.ts.map