//#region src/isDeepEqual.d.ts
/**
 * Performs a *deep structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays the check would be performed on every item recursively, in order, and
 * for objects all props will be compared recursively.
 *
 * The built-in Date and RegExp are special-cased and will be compared by their
 * values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are not supported
 * right now and might result in unexpected behavior. Please open an issue in
 * the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to
 * check for simple (`===`, `Object.is`) equality.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(data, other)
 * @example
 *    R.isDeepEqual(1, 1) //=> true
 *    R.isDeepEqual(1, '1') //=> false
 *    R.isDeepEqual([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Guard
 */
declare function isDeepEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
declare function isDeepEqual<T>(data: T, other: T): boolean;
/**
 * Performs a *deep structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays the check would be performed on every item recursively, in order, and
 * for objects all props will be compared recursively.
 *
 * The built-in Date and RegExp are special-cased and will be compared by their
 * values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are not supported
 * right now and might result in unexpected behavior. Please open an issue in
 * the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to
 * check for simple (`===`, `Object.is`) equality.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(other)(data)
 * @example
 *    R.pipe(1, R.isDeepEqual(1)); //=> true
 *    R.pipe(1, R.isDeepEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isDeepEqual([1, 2, 3])); //=> true
 * @dataLast
 * @category Guard
 */
declare function isDeepEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
declare function isDeepEqual<T>(other: T): (data: T) => boolean;
//#endregion
export { isDeepEqual as t };
//# sourceMappingURL=isDeepEqual-DCldfQqM.d.ts.map