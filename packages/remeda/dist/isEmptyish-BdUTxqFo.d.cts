import { t as TupleParts } from "./TupleParts-CqxD-ozC.cjs";
import { t as NoInfer } from "./NoInfer-BVsJ7PYk.cjs";
import { And, HasRequiredKeys, IsAny, IsEqual, IsNever, IsNumericLiteral, IsUnknown, OmitIndexSignature, Or, Tagged, ValueOf } from "type-fest";

//#region src/internal/types/HasWritableKeys.d.ts
type HasWritableKeys<T> = IsEqual<Readonly<T>, T> extends true ? false : true;
//#endregion
//#region src/isEmptyish.d.ts
declare const EMPTYISH_BRAND: unique symbol;
type Empty<T> = Tagged<T, typeof EMPTYISH_BRAND>;
type Emptyish<T> = (T extends string ? "" : never) | (T extends object ? EmptyishObjectLike<T> : never) | (T extends null ? null : never) | (T extends undefined ? undefined : never);
type EmptyishObjectLike<T extends object> = T extends ReadonlyArray<unknown> ? EmptyishArray<T> : T extends ReadonlyMap<infer Key, unknown> ? T extends Map<unknown, unknown> ? Empty<T> : ReadonlyMap<Key, never> : T extends ReadonlySet<unknown> ? T extends Set<unknown> ? Empty<T> : ReadonlySet<never> : EmptyishObject<T>;
type EmptyishArray<T extends ReadonlyArray<unknown>> = T extends readonly [] ? T : And<IsEqual<TupleParts<T>["required"], []>, IsEqual<TupleParts<T>["suffix"], []>> extends true ? T extends Array<unknown> ? Empty<T> : readonly [] : never;
type EmptyishObject<T extends object> = T extends {
  length: infer Length extends number;
} ? T extends string ? never : EmptyishArbitrary<T, Length> : T extends {
  size: infer Size extends number;
} ? EmptyishArbitrary<T, Size> : IsNever<ValueOf<T>> extends true ? T : HasRequiredKeys<OmitIndexSignature<T>> extends true ? never : HasWritableKeys<T> extends true ? Empty<T> : { readonly [P in keyof T]: never };
type EmptyishArbitrary<T, N> = IsNumericLiteral<N> extends true ? [0] extends [N] ? [N] extends [0] ? T : Empty<T> : never : Empty<T>;
type ShouldNotNarrow<T> = Or<Or<IsAny<T>, IsUnknown<T>>, IsEqual<T, {}>>;
/**
 * A function that checks if the input is empty. Empty is defined as anything
 * exposing a numerical `length`, or `size` property that is equal to `0`. This
 * definition covers strings, arrays, Maps, Sets, plain objects, and custom
 * classes. Additionally, `null` and `undefined` are also considered empty.
 *
 * `number`, `bigint`, `boolean`, `symbol`, and `function` will always return
 * `false`. `RegExp`, `Date`, and weak collections will always return `true`.
 * Classes and Errors are treated as plain objects: if they expose any public
 * property they would be considered non-empty, unless they expose a numerical
 * `length` or `size` property, which defines their emptiness regardless of
 * other properties.
 *
 * This function has *limited* utility at the type level because **negating** it
 * does not yield a useful type in most cases because of TypeScript
 * limitations. Additionally, utilities which accept a narrower input type
 * provide better type-safety on their inputs. In most cases, you should use
 * one of the following functions instead:
 * * `isEmpty` - provides better type-safety on inputs by accepting a narrower set of cases.
 * * `hasAtLeast` - when the input is just an array/tuple.
 * * `isStrictEqual` - when you just need to check for a specific literal value.
 * * `isNullish` - when you just care about `null` and `undefined`.
 * * `isTruthy` - when you need to also filter `number` and `boolean`.
 *
 * @param data - The variable to check.
 * @signature
 *    R.isEmptyish(data)
 * @example
 *    R.isEmptyish(undefined); //=> true
 *    R.isEmptyish(null); //=> true
 *    R.isEmptyish(''); //=> true
 *    R.isEmptyish([]); //=> true
 *    R.isEmptyish({}); //=> true
 *    R.isEmptyish(new Map()); //=> true
 *    R.isEmptyish(new Set()); //=> true
 *    R.isEmptyish({ a: "hello", size: 0 }); //=> true
 *    R.isEmptyish(/abc/); //=> true
 *    R.isEmptyish(new Date()); //=> true
 *    R.isEmptyish(new WeakMap()); //=> true
 *
 *    R.isEmptyish('test'); //=> false
 *    R.isEmptyish([1, 2, 3]); //=> false
 *    R.isEmptyish({ a: "hello" }); //=> false
 *    R.isEmptyish({ length: 1 }); //=> false
 *    R.isEmptyish(0); //=> false
 *    R.isEmptyish(true); //=> false
 *    R.isEmptyish(() => {}); //=> false
 * @category Guard
 */
declare function isEmptyish<T>(data: ShouldNotNarrow<T> extends true ? never : T | Readonly<Emptyish<NoInfer<T>>>): data is ShouldNotNarrow<T> extends true ? never : T extends unknown ? Emptyish<NoInfer<T>> : never;
declare function isEmptyish(data: unknown): boolean;
//#endregion
export { isEmptyish as t };
//# sourceMappingURL=isEmptyish-BdUTxqFo.d.cts.map