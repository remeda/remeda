import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { n as IsBounded, t as IsBoundedRecord } from "./IsBoundedRecord-DBhikMQR.js";
import { t as PartitionByUnion } from "./PartitionByUnion-BwNXrE0e.js";
import { EmptyObject, IsNever, KeysOfUnion, Writable } from "type-fest";

//#region src/pick.d.ts
type PickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> = T extends unknown ? Keys extends unknown ? IsNever<Extract<Keys[number], keyof T>> extends true ? EmptyObject : Writable<IsBoundedRecord<T> extends true ? PickBoundedFromArray<T, Keys> : PickUnbounded<T, Extract<Keys[number], keyof T>>> : never : never;
/**
 * Bounded records have bounded keys and result in a bounded output. The only
 * question left is whether to add the prop as-is, or make it optional. This
 * can be determined by the part of the keys array the prop is defined in, and
 * the way that element is defined: if the array contains a singular literal
 * key in either the required prefix or the suffix, we know that prop should be
 * picked as-is, otherwise, the key might not be present in the keys array so it
 * can only be picked optionally.
 */
type PickBoundedFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> = Pick<T, Extract<PartitionByUnion<TupleParts<Keys>["required"]>["singular"] | PartitionByUnion<TupleParts<Keys>["suffix"]>["singular"], keyof T>> & Partial<Pick<T, Extract<PartitionByUnion<TupleParts<Keys>["required"]>["union"] | TupleParts<Keys>["optional"][number] | TupleParts<Keys>["item"] | PartitionByUnion<TupleParts<Keys>["suffix"]>["union"], keyof T>>>;
/**
 * The built-in `Pick` is weird when it comes to picking bounded keys from
 * unbounded records. It reconstructs the output object regardless of the shape
 * of the input: `Pick<Record<string, "world">, "hello">` results in the type
 * `{ hello: "world" }`, but you'd expect it to be optional because we don't
 * know if the record contains a `hello` prop or not!
 *
 * !Important: We assume T is unbounded and don't test for it!
 *
 * See: https://www.typescriptlang.org/play/?#code/PTAEE0HsFcHIBNQFMAeAHJBjALqAGqNpKAEZKigAGA3qABZIA2jkA-AFygBEA7pAE6N4XUAF9KAGlLRcAQ0ayAzgChsATwz5QAXlAAFAJaYA1gB4ASlgHxTi7PwMA7AOZTeAoVwB8bhs0jeANzKIBSgAHqsykA.
 */
type PickUnbounded<T, Keys extends keyof T> = IsBounded<Keys> extends true ? Partial<Pick<T, Keys>> : Pick<T, Keys>;
/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param keys - The property names.
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
declare function pick<T extends object, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(keys: Keys): (data: T) => PickFromArray<T, Keys>;
/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param data - The target object.
 * @param keys - The property names.
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
declare function pick<T extends object, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(data: T, keys: Keys): PickFromArray<T, Keys>;
//#endregion
export { pick as t };
//# sourceMappingURL=pick-BFS-UlBi.d.ts.map