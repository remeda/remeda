import { t as IsBoundedRecord } from "./IsBoundedRecord-grQnK-7k.cjs";
import { t as ToString } from "./ToString-CJ-2sq3i.cjs";
import { t as EnumerableStringKeyOf } from "./EnumerableStringKeyOf-W2Ux4Jod.cjs";
import { t as EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf-C9FHkpHc.cjs";
import { IsNever, Simplify } from "type-fest";

//#region src/pickBy.d.ts
type EnumeratedPartial<T> = T extends unknown ? Simplify<IsBoundedRecord<T> extends true ? { -readonly [P in keyof T as ToString<P>]?: Required<T>[P] } : Record<EnumerableStringKeyOf<T>, EnumerableStringKeyedValueOf<T>>> : never;
type EnumeratedPartialNarrowed<T, S> = T extends unknown ? Simplify<IsBoundedRecord<T> extends true ? ExactProps<T, S> & PartialProps<T, S> : Record<EnumerableStringKeyOf<T>, Extract<EnumerableStringKeyedValueOf<T>, S>>> : never;
type ExactProps<T, S> = { -readonly [P in keyof T as ToString<IsExactProp<T, P, S> extends true ? P : never>]: Extract<Required<T>[P], S> };
type PartialProps<T, S> = { -readonly [P in keyof T as ToString<IsPartialProp<T, P, S> extends true ? P : never>]?: IsNever<Extract<T[P], S>> extends true ? S extends T[P] ? S : never : Extract<T[P], S> };
type IsExactProp<T, P$1 extends keyof T, S> = T[P$1] extends Extract<T[P$1], S> ? true : false;
type IsPartialProp<T, P$1 extends keyof T, S> = IsExactProp<T, P$1, S> extends true ? false : IsNever<Extract<T[P$1], S>> extends true ? S extends T[P$1] ? true : false : true;
/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.pickBy(data, predicate)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
declare function pickBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): EnumeratedPartialNarrowed<T, S>;
declare function pickBy<T extends object>(data: T, predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): EnumeratedPartial<T>;
/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @signature
 *   R.pickBy(predicate)(data)
 * @example
 *    R.pipe({a: 1, b: 2, A: 3, B: 4}, pickBy((val, key) => key.toUpperCase() === key)); // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
declare function pickBy<T extends object, S extends EnumerableStringKeyedValueOf<T>>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => value is S): (data: T) => EnumeratedPartialNarrowed<T, S>;
declare function pickBy<T extends object>(predicate: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => boolean): (data: T) => EnumeratedPartial<T>;
//#endregion
export { pickBy as t };
//# sourceMappingURL=pickBy-DBzWg1Wf.d.cts.map