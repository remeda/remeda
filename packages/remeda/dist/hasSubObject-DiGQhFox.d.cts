import { Simplify, Tagged } from "type-fest";

//#region src/hasSubObject.d.ts
declare const HAS_SUB_OBJECT_BRAND: unique symbol;
type HasSubObjectGuard<T, S> = Simplify<Tagged<S & T, typeof HAS_SUB_OBJECT_BRAND>>;
type HasSubObjectObjectValue<A, B> = Partial<{ [Key in keyof A & keyof B]: A[Key] & B[Key] extends never ? B[Key] : A[Key] | B[Key] extends object ? HasSubObjectObjectValue<A[Key], B[Key]> : A[Key] & B[Key] extends object ? B[Key] : A[Key] }> & { [Key in Exclude<keyof A, keyof B> | Exclude<keyof B, keyof A>]: Key extends keyof B ? B[Key] : never };
type HasSubObjectData<Data, SubObject, RData = Required<Data>, RSubObject = Required<SubObject>> = Partial<{ [Key in keyof RData & keyof RSubObject]: RData[Key] & RSubObject[Key] extends never ? RSubObject[Key] : RData[Key] | RSubObject[Key] extends object ? HasSubObjectObjectValue<RData[Key], RSubObject[Key]> : RData[Key] & RSubObject[Key] extends object ? RSubObject[Key] : RData[Key] }> & { [Key in Exclude<keyof SubObject, keyof Data>]: SubObject[Key] };
type HasSubObjectSubObject<SubObject, Data, RSubObject = Required<SubObject>, RData = Required<Data>> = Partial<{ [Key in keyof RData & keyof RSubObject]: RData[Key] & RSubObject[Key] extends never ? RData[Key] : RData[Key] | RSubObject[Key] extends object ? HasSubObjectObjectValue<RSubObject[Key], RData[Key]> : RData[Key] & RSubObject[Key] extends object ? RData[Key] : RSubObject[Key] }> & Record<Exclude<keyof SubObject, keyof Data>, never>;
/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(data, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 */
declare function hasSubObject<T extends object, S extends HasSubObjectSubObject<S, T>>(data: T, subObject: S): data is HasSubObjectGuard<T, S>;
/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 */
declare function hasSubObject<S extends object>(subObject: S): <T extends HasSubObjectData<T, S>>(data: T) => data is HasSubObjectGuard<T, S>;
//#endregion
export { hasSubObject as t };
//# sourceMappingURL=hasSubObject-DiGQhFox.d.cts.map