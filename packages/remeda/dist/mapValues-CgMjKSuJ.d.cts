import { t as EnumerableStringKeyOf } from "./EnumerableStringKeyOf-W2Ux4Jod.cjs";
import { t as EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf-C9FHkpHc.cjs";
import { Simplify } from "type-fest";

//#region src/mapValues.d.ts
type MappedValues<T extends object, Value> = Simplify<{ -readonly [P in keyof T as P extends number | string ? P : never]: Value }>;
/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param data - The object to map.
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(data, mapper)
 * @example
 *    R.mapValues({a: 1, b: 2}, (value, key) => value + key) // => {a: '1a', b: '2b'}
 * @dataFirst
 * @category Object
 */
declare function mapValues<T extends object, Value>(data: T, valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): MappedValues<T, Value>;
/**
 * Maps values of `object` and keeps the same keys. Symbol keys are not passed
 * to the mapper and will be removed from the output object.
 *
 * To also copy the symbol keys to the output use merge:
 * `merge(data, mapValues(data, mapper))`).
 *
 * @param valueMapper - The mapping function.
 * @signature
 *    R.mapValues(mapper)(data)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapValues((value, key) => value + key)) // => {a: '1a', b: '2b'}
 * @dataLast
 * @category Object
 */
declare function mapValues<T extends object, Value>(valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): (data: T) => MappedValues<T, Value>;
//#endregion
export { mapValues as t };
//# sourceMappingURL=mapValues-CgMjKSuJ.d.cts.map