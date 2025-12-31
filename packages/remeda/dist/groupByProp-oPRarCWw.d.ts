import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { t as BoundedPartial } from "./BoundedPartial-DNMbxHAa.js";
import { t as FilteredArray } from "./FilteredArray-CzgY4yyY.js";
import { t as ArrayRequiredPrefix } from "./ArrayRequiredPrefix-BQgcBIkt.js";
import { AllUnionFields, ConditionalKeys, EmptyObject, IsNever, Or, Simplify } from "type-fest";

//#region src/groupByProp.d.ts
type GroupByProp<T extends IterableContainer, Prop extends GroupableProps<T>> = T extends unknown ? FixEmptyObject<EnsureValuesAreNonEmpty<GroupByPropRaw<T, Prop>>> : never;
type GroupByPropRaw<T extends IterableContainer, Prop extends GroupableProps<T>> = { [Value in AllPropValues<T, Prop>]: FilteredArray<T, Record<Prop, Value>> };
type GroupableProps<T extends IterableContainer> = ConditionalKeys<ItemsSuperObject<T>, PropertyKey | undefined>;
type AllPropValues<T extends IterableContainer, Prop extends GroupableProps<T>> = Extract<ItemsSuperObject<T>[Prop], PropertyKey>;
type ItemsSuperObject<T extends IterableContainer> = AllUnionFields<Exclude<T[number], undefined>>;
type FixEmptyObject<T> = IsNever<keyof T> extends true ? EmptyObject : T;
type EnsureValuesAreNonEmpty<T extends Record<PropertyKey, IterableContainer>> = Simplify<Omit<T, PossiblyEmptyArrayKeys<T>> & BoundedPartial<CoercedNonEmptyValues<Pick<T, PossiblyEmptyArrayKeys<T>>>>>;
type PossiblyEmptyArrayKeys<T extends Record<PropertyKey, IterableContainer>> = keyof T extends infer Key extends unknown ? Key extends keyof T ? IsNonEmptyArray<T[Key]> extends true ? never : Key : never : never;
type IsNonEmptyArray<T extends IterableContainer> = Or<IsNonEmptyFixedTuple<TupleParts<T>["required"]>, IsNonEmptyFixedTuple<TupleParts<T>["suffix"]>>;
type IsNonEmptyFixedTuple<T> = IsNever<Extract<T, readonly []>>;
type CoercedNonEmptyValues<T extends Record<PropertyKey, IterableContainer>> = { [P in keyof T]: ArrayRequiredPrefix<T[P], 1> };
/**
 * Groups the elements of an array of objects based on the values of a
 * specified property of those objects. The result would contain a property for
 * each unique value of the specific property, with it's value being the input
 * array filtered to only items that have that property set to that value.
 * For any object where the property is missing, or if it's value is
 * `undefined` the item would be filtered out.
 *
 * The grouping property is enforced at the type level to exist in at least one
 * item and to never have a value that cannot be used as an object key (e.g. it
 * must be `PropertyKey | undefined`).
 *
 * The resulting arrays are filtered with the prop and it's value as a
 * type-guard, effectively narrowing the items in each output arrays. This
 * means that when the grouping property is the discriminator of a
 * discriminated union type each output array would contain just the subtype for
 * that value.
 *
 * If you need more control over the grouping you should use `groupBy` instead.
 *
 * @param data - The items to group.
 * @param prop - The property name to group by.
 * @signature
 *    R.groupByProp(data, prop)
 * @example
 *    const result = R.groupByProp(
 *      //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
 *      [{ a: 'cat' }, { a: 'dog' }] as const,
 *      'a',
 *    );
 * @dataFirst
 * @category Array
 */
declare function groupByProp<T extends IterableContainer, const Prop extends GroupableProps<T>>(data: T, prop: Prop): GroupByProp<T, Prop>;
/**
 * Groups the elements of an array of objects based on the values of a
 * specified property of those objects. The result would contain a property for
 * each unique value of the specific property, with it's value being the input
 * array filtered to only items that have that property set to that value.
 * For any object where the property is missing, or if it's value is
 * `undefined` the item would be filtered out.
 *
 * The grouping property is enforced at the type level to exist in at least one
 * item and to never have a value that cannot be used as an object key (e.g. it
 * must be `PropertyKey | undefined`).
 *
 * The resulting arrays are filtered with the prop and it's value as a
 * type-guard, effectively narrowing the items in each output arrays. This
 * means that when the grouping property is the discriminator of a
 * discriminated union type each output array would contain just the subtype for
 * that value.
 *
 * If you need more control over the grouping you should use `groupBy` instead.
 *
 * @param prop - The property name to group by.
 * @signature
 *    R.groupByProp(prop)(data);
 * @example
 *    const result = R.pipe(
 *      //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
 *      [{ a: 'cat' }, { a: 'dog' }] as const,
 *      R.groupByProp('a'),
 *    );
 * @dataLast
 * @category Array
 */
declare function groupByProp<T extends IterableContainer, const Prop extends GroupableProps<T>>(prop: Prop): (data: T) => GroupByProp<T, Prop>;
//#endregion
export { groupByProp as t };
//# sourceMappingURL=groupByProp-oPRarCWw.d.ts.map