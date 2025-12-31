//#region src/objOf.d.ts
/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param value - The object value.
 * @param key - The property name.
 * @signature
 *    R.objOf(value, key)
 * @example
 *    R.objOf(10, 'a') // => { a: 10 }
 * @category Object
 */
declare function objOf<T, K extends string>(value: T, key: K): Record<K, T>;
/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param key - The property name.
 * @signature
 *    R.objOf(key)(value)
 * @example
 *    R.pipe(10, R.objOf('a')) // => { a: 10 }
 * @category Object
 */
declare function objOf<T, K extends string>(key: K): (value: T) => Record<K, T>;
//#endregion
export { objOf as t };
//# sourceMappingURL=objOf-BQrjnzry.d.ts.map