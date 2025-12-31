import { t as EnumerableStringKeyOf } from "./EnumerableStringKeyOf-W2Ux4Jod.cjs";
import { t as EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf-C9FHkpHc.cjs";

//#region src/forEachObj.d.ts

/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param data - The object who'se entries would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @dataFirst
 * @category Object
 */
declare function forEachObj<T extends object>(data: T, callbackfn: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, obj: T) => void): void;
/**
 * Iterate an object using a defined callback function.
 *
 * The dataLast version returns the original object (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned object is the
 * same reference as the input object, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original object (the ref itself, not a shallow copy of it).
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @dataLast
 * @category Object
 */
declare function forEachObj<T extends object>(callbackfn: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, obj: T) => void): (object: T) => T;
//#endregion
export { forEachObj as t };
//# sourceMappingURL=forEachObj-0k-U_4mP.d.cts.map