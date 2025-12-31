import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { n as IsBounded, t as IsBoundedRecord } from "./IsBoundedRecord-DBhikMQR.js";
import { t as PartitionByUnion } from "./PartitionByUnion-BwNXrE0e.js";
import { EmptyObject, IsNever, KeysOfUnion } from "type-fest";

//#region src/internal/types/SimplifiedWritable.d.ts

/**
 * Type-fest's `Writable` acts funny for complex types involving intersections
 * that redefine the same key, because of how it reconstructs the output type
 * keys eagerly. Instead, this type is based on the `Simplify` utility type
 * which avoids this problem.
 *
 * @see Writable
 * @see Simplify
 */
type SimplifiedWritable<T> = { -readonly [KeyType in keyof T]: T[KeyType] } & {};
//#endregion
//#region src/omit.d.ts
type OmitFromArray<T, Keys extends ReadonlyArray<PropertyKey>> = T extends unknown ? Keys extends unknown ? SimplifiedWritable<IsNever<Extract<Keys[number], keyof T>> extends true ? T : IsBoundedRecord<T> extends true ? OmitBounded<T, Keys> : OmitUnbounded<T, Keys>> : never : never;
type OmitBounded<T, Keys extends ReadonlyArray<PropertyKey>> = FixEmpty<Omit<T, Keys[number]>> & Partial<Pick<T, Exclude<PartitionByUnion<TupleParts<Keys>["required"]>["union"] | TupleParts<Keys>["optional"][number] | TupleParts<Keys>["item"] | PartitionByUnion<TupleParts<Keys>["suffix"]>["union"], PartitionByUnion<TupleParts<Keys>["required"]>["singular"] | PartitionByUnion<TupleParts<Keys>["suffix"]>["singular"]>>>;
/**
 * The built-in `Omit` type doesn't handle unbounded records correctly! When
 * omitting an unbounded key the result should be untouched as we can't tell
 * what got removed, and can't represent an object that had "something" removed
 * from it, but instead it returns `{}`(?!) The same thing applies when a key
 * is only optionally omitted for the same reasons. This is why we don't use
 * `Omit` at all for the unbounded case.
 *
 * @see https://www.typescriptlang.org/play/?#code/C4TwDgpgBAqgdgIwPYFc4BMLqgXigeQFsBLYAHgCUIBjJAJ3TIGdg7i4BzAGigCIALCABshSXgD4eLNp3EBuAFAB6JVDUA9APxA
 */
type OmitUnbounded<T, Keys extends ReadonlyArray<PropertyKey>> = T & Record<Bounded<PartitionByUnion<TupleParts<Keys>["required"]>["singular"] | PartitionByUnion<TupleParts<Keys>["suffix"]>["singular"]>, never>;
/**
 * When `Omit` omits **all** keys from a bounded record it results in `{}` which
 * doesn't match what we'd expect to be returned in terms of a useful type as
 * the output of `Omit`.
 */
type FixEmpty<T> = IsNever<keyof T> extends true ? EmptyObject : T;
/**
 * Filter a union of types, leaving only those that are bounded. e.g.,
 * `Bounded<"a" | number>` results in `"a"`.
 */
type Bounded<T> = T extends unknown ? IsBounded<T> extends true ? T : never : never;
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param keys - The property names.
 * @signature
 *    R.omit(keys)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
declare function omit<T, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(keys: Keys): (data: T) => OmitFromArray<T, Keys>;
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param data - The object.
 * @param keys - The property names.
 * @signature
 *    R.omit(obj, keys);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
declare function omit<T, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(data: T, keys: Keys): OmitFromArray<T, Keys>;
//#endregion
export { omit as t };
//# sourceMappingURL=omit-BTHu0t_t.d.ts.map