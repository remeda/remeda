import { t as IntRangeInclusive } from "./IntRangeInclusive-DVg2mi2m.js";
import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { t as ClampedIntegerSubtract } from "./ClampedIntegerSubtract-RjA0M8T2.js";
import { t as NoInfer } from "./NoInfer-CRoR3-jj.js";
import { ArrayIndices, IsNumericLiteral, KeysOfUnion } from "type-fest";

//#region src/internal/types/ArrayAt.d.ts

/**
 * The type for the I'th element in the tuple T. This type corrects some of the
 * issues with TypeScript's built-in tuple accessor inference `T[I]` for arrays
 * and tuples with fixed suffixes, and for primitive indices where we don't know
 * if the index is out of bounds.
 */
type ArrayAt<T extends IterableContainer, I extends keyof T> = IsNumericLiteral<I> extends true ? I extends unknown ? [...TupleParts<T>["required"], ...TupleParts<T>["optional"]] extends infer Prefix extends ReadonlyArray<unknown> ? HasIndex<Prefix, I> extends true ? T[I] : TupleParts<T>["item"] | (ClampedIntegerSubtract<I, Prefix["length"]> extends infer SuffixIndex extends number ? HasIndex<TupleParts<T>["suffix"], SuffixIndex> extends true ? TupleParts<T>["suffix"][IntRangeInclusive<0, SuffixIndex>] :
// But if the index is out of the suffix it can be out-of-
TupleParts<T>["suffix"][number] | undefined : never) : never : never :
// Even with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
T[number] | undefined;
type HasIndex<T extends ReadonlyArray<unknown>, I> = I extends ArrayIndices<T> ? true : false;
//#endregion
//#region src/prop.d.ts
type KeysDeep<T, Path extends ReadonlyArray<unknown>> = KeysOfUnion<PropDeep<T, Path>>;
type PropDeep<T, Path extends ReadonlyArray<unknown>> = Path extends readonly [infer Key, ...infer Rest] ? PropDeep<Prop<T, Key>, Rest> : T;
type Prop<T, Key$1> = T extends unknown ? Key$1 extends keyof T ? T extends ReadonlyArray<unknown> ? ArrayAt<T, Key$1> : T[Key$1] : undefined : never;
type NonPropertyKey = object | null | undefined;
/**
 * Gets the value of the given property from an object. Nested properties can
 * be accessed by providing a variadic array of keys that define the path from
 * the root to the desired property. Arrays can be accessed by using numeric
 * keys. Unions and optional properties are handled gracefully by returning
 * `undefined` early for any non-existing property on the path. Paths are
 * validated against the object type to provide stronger type safety, better
 * compile-time errors, and to enable autocompletion in IDEs.
 *
 * @param data - The object or array to access.
 * @param key - The key(s) for the property to extract.
 * @signature
 *   R.prop(data, ...keys);
 * @example
 *   R.prop({ foo: { bar: 'baz' } }, 'foo'); //=> { bar: 'baz' }
 *   R.prop({ foo: { bar: 'baz' } }, 'foo', 'bar'); //=> 'baz'
 *   R.prop(["cat", "dog"], 1); //=> 'dog'
 * @dataFirst
 * @category Object
 */
declare function prop<T extends NonPropertyKey, Key$1 extends KeysDeep<T, []>>(data: T, key: Key$1): NoInfer<Prop<T, Key$1>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>>(data: T, key0: Key0, key1: Key1): NoInfer<PropDeep<T, [Key0, Key1]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>>(data: T, key0: Key0, key1: Key1, key2: Key2): NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>, Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7, key8: Key8): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>, Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>, Key9 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>, AdditionalKeys extends ReadonlyArray<PropertyKey> = []>(data: T, key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7, key8: Key8, key9: Key9, ...additionalKeys: AdditionalKeys): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8, Key9, ...AdditionalKeys]>>;
/**
 * Gets the value of the given property from an object. Nested properties can
 * be accessed by providing a variadic array of keys that define the path from
 * the root to the desired property. Arrays can be accessed by using numeric
 * keys. Unions and optional properties are handled gracefully by returning
 * `undefined` early for any non-existing property on the path. Paths are
 * validated against the object type to provide stronger type safety, better
 * compile-time errors, and to enable autocompletion in IDEs.
 *
 * @param key - The key(s) for the property to extract.
 * @signature
 *   R.prop(...keys)(data);
 * @example
 *   R.pipe({ foo: { bar: 'baz' } }, R.prop('foo')); //=> { bar: 'baz' }
 *   R.pipe({ foo: { bar: 'baz' } }, R.prop('foo', 'bar')); //=> 'baz'
 *   R.pipe(["cat", "dog"], R.prop(1)); //=> 'dog'
 * @dataLast
 * @category Object
 */
declare function prop<T extends NonPropertyKey, Key$1 extends KeysOfUnion<T>>(key: Key$1): (data: T) => NoInfer<Prop<T, Key$1>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>>(key0: Key0, key1: Key1): (data: T) => NoInfer<PropDeep<T, [Key0, Key1]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>>(key0: Key0, key1: Key1, key2: Key2): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>, Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7, key8: Key8): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>>;
declare function prop<T extends NonPropertyKey, Key0 extends KeysDeep<T, []>, Key1 extends KeysDeep<T, [Key0]>, Key2 extends KeysDeep<T, [Key0, Key1]>, Key3 extends KeysDeep<T, [Key0, Key1, Key2]>, Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>, Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>, Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>, Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>, Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>, Key9 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>, AdditionalKeys extends ReadonlyArray<PropertyKey> = []>(key0: Key0, key1: Key1, key2: Key2, key3: Key3, key4: Key4, key5: Key5, key6: Key6, key7: Key7, key8: Key8, key9: Key9, ...additionalKeys: AdditionalKeys): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8, Key9, ...AdditionalKeys]>>;
declare function prop<K extends PropertyKey>(key: K): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];
//#endregion
export { prop as t };
//# sourceMappingURL=prop-CU_ylBuO.d.ts.map