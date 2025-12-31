import { t as IsBoundedRecord } from "./IsBoundedRecord-DBhikMQR.js";
import { t as EnumerableStringKeyOf } from "./EnumerableStringKeyOf-Bjvd7GEA.js";
import { t as EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf-BDwuDgde.js";
import { IsNever, Or, Simplify } from "type-fest";

//#region src/omitBy.d.ts
type PickSymbolKeys<T extends object> = { -readonly [P in keyof T as P extends symbol ? P : never]: T[P] };
type PartialEnumerableKeys<T extends object> = T extends unknown ? Simplify<IsBoundedRecord<T> extends true ? PickSymbolKeys<T> & { -readonly [P in keyof T as P extends symbol ? never : P]?: Required<T>[P] } : Record<EnumerableStringKeyOf<T>, EnumerableStringKeyedValueOf<T>>> : never;
type PartialEnumerableKeysNarrowed<T extends object, S> = Simplify<ExactProps<T, S> & PartialProps<T, S> & PickSymbolKeys<T>>;
type ExactProps<T, S> = { -readonly [P in keyof T as IsExactProp<T, P, S> extends true ? P : never]: Exclude<T[P], S> };
type PartialProps<T, S> = { -readonly [P in keyof T as IsPartialProp<T, P, S> extends true ? P : never]?: Exclude<T[P], S> };
type IsExactProp<T, P$1 extends keyof T, S> = P$1 extends symbol ? false : T[P$1] extends Exclude<T[P$1], S> ? S extends T[P$1] ? false : true : false;
type IsPartialProp<T, P$1 extends keyof T, S> = P$1 extends symbol ? false : Or<IsExactProp<T, P$1, S>, IsNever<Exclude<Required<T>[P$1], S>>> extends true ? false : true;
/**
 * Creates a shallow copy of the data, and then removes any keys that the
 * predicate rejects. Symbol keys are not passed to the predicate and would be
 * passed through to the output as-is.
 *
 * See `pickBy` for a complementary function which starts with an empty object
 * and adds the entries that the predicate accepts. Because it is additive,
 * symbol keys will not be passed through to the output object.
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns `true` if the entry shouldn't be part of the output object, or
 * `false` to keep it. If the function is a type-guard on the value the output
 * type would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.omitBy(data, predicate)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
declare function omitBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): PartialEnumerableKeysNarrowed<T, S>;
declare function omitBy<T extends object>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): PartialEnumerableKeys<T>;
/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param predicate - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
declare function omitBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): (data: T) => PartialEnumerableKeysNarrowed<T, S>;
declare function omitBy<T extends object>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): (data: T) => PartialEnumerableKeys<T>;
//#endregion
export { omitBy as t };
//# sourceMappingURL=omitBy-BgFGXVvR.d.ts.map