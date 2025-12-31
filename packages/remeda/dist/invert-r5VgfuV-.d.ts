import { t as ToString } from "./ToString-CapK98PN.js";
import { Simplify } from "type-fest";

//#region src/invert.d.ts
type Inverted<T extends object> = Simplify<{ -readonly [K in keyof T as K extends number | string ? Required<T>[K] extends PropertyKey ? Required<T>[K] : never : never]: ToString<K> }>;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param object - The object.
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
declare function invert<T extends object>(object: T): Inverted<T>;
/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
declare function invert<T extends object>(): (object: T) => Inverted<T>;
//#endregion
export { invert as t };
//# sourceMappingURL=invert-r5VgfuV-.d.ts.map