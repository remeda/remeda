//#region src/isShallowEqual.d.ts
/**
 * Performs a *shallow structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays a **strict equality** check would be performed on every item, in
 * order, and for objects props will be matched and checked for **strict
 * equality**; Unlike `isDeepEqual` where the function also *recurses* into each
 * item and value.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: Promise, Date, and RegExp, are shallowly equal, even when they
 * are semantically different (e.g. resolved promises); but `isDeepEqual` does
 * compare the latter 2 semantically by-value.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to check
 * for simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(data, other)
 * @example
 *    R.isShallowEqual(1, 1) //=> true
 *    R.isShallowEqual(1, '1') //=> false
 *    R.isShallowEqual([1, 2, 3], [1, 2, 3]) //=> true
 *    R.isShallowEqual([[1], [2], [3]], [[1], [2], [3]]) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isShallowEqual<T, S extends T>(data: T, other: T extends Exclude<T, S> ? S : never): data is S;
declare function isShallowEqual<T>(data: T, other: T): boolean;
/**
 * Performs a *shallow structural* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays a **strict equality** check would be performed on every item, in
 * order, and for objects props will be matched and checked for **strict
 * equality**; Unlike `isDeepEqual` where the function also *recurses* into each
 * item and value.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: All built-in objects (Promise, Date, RegExp) are shallowly equal,
 * even when they are semantically different (e.g. resolved promises). Use
 * `isDeepEqual` instead.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isStrictEqual` if you don't need a deep comparison and just want to check
 * for simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(other)(data)
 * @example
 *    R.pipe(1, R.isShallowEqual(1)) //=> true
 *    R.pipe(1, R.isShallowEqual('1')) //=> false
 *    R.pipe([1, 2, 3], R.isShallowEqual([1, 2, 3])) //=> true
 *    R.pipe([[1], [2], [3]], R.isShallowEqual([[1], [2], [3]])) //=> false
 * @dataFirst
 * @category Guard
 */
declare function isShallowEqual<T, S extends T>(other: T extends Exclude<T, S> ? S : never): (data: T) => data is S;
declare function isShallowEqual<T>(other: T): (data: T) => boolean;
//#endregion
export { isShallowEqual as t };
//# sourceMappingURL=isShallowEqual-Cn4vv3cS.d.cts.map