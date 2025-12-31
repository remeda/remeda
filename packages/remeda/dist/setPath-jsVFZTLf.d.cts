import { t as RemedaTypeError } from "./RemedaTypeError-DGiM-bRZ.cjs";
import { ValueOf } from "type-fest";

//#region src/setPath.d.ts
type Paths<T, Prefix extends ReadonlyArray<unknown> = []> = Prefix | (T extends object ? ValueOf<{ [K in ProperKeyOf<T>]-?: Paths<T[K], [...Prefix, K]> }> : RemedaTypeError<"setPath", "Can only compute paths objects", {
  type: never;
  metadata: T;
}>) extends infer Path ? Readonly<Path> : never;
/**
 * Array objects have all Array.prototype keys in their "keyof" type, which
 * is not what we'd expect from the operator. We only want the numeric keys
 * which represent proper elements of the array.
 */
type ProperKeyOf<T> = Extract<keyof T, T extends ReadonlyArray<unknown> ? number : keyof T>;
type ValueAtPath<T, Path$1> = Path$1 extends readonly [infer Head extends keyof T, ...infer Rest] ? ValueAtPath<T[Head], Rest> : T;
/**
 * Sets the value at `path` of `object`.
 *
 * For simple cases where the path is only one level deep, prefer `set` instead.
 *
 * @param data - The target method.
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
declare function setPath<T, Path$1 extends Paths<T>>(data: T, path: Path$1, value: ValueAtPath<T, Path$1>): T;
/**
 * Sets the value at `path` of `object`.
 *
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(path, value)(obj)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
declare function setPath<T, Path$1 extends Paths<T>, Value extends ValueAtPath<T, Path$1>>(path: Path$1, value: Value): (data: T) => T;
//#endregion
export { setPath as t };
//# sourceMappingURL=setPath-jsVFZTLf.d.cts.map