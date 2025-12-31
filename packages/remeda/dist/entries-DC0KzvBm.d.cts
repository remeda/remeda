import { t as ToString } from "./ToString-CJ-2sq3i.cjs";
import { Simplify, ValueOf } from "type-fest";

//#region src/entries.d.ts
type Entry<T> = Simplify<ValueOf<{ [P in Exclude<keyof T, symbol>]-?: [key: ToString<P>, value: Required<T>[P]] }>>;
/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param data - Object to return keys and values of.
 * @signature
 *    R.entries(object)
 * @example
 *    R.entries({ a: 1, b: 2, c: 3 }); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataFirst
 * @category Object
 */
declare function entries<T extends {}>(data: T): Array<Entry<T>>;
/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @signature
 *    R.entries()(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3 }, R.entries()); // => [['a', 1], ['b', 2], ['c', 3]]
 * @dataLast
 * @category Object
 */
declare function entries(): <T extends {}>(data: T) => Array<Entry<T>>;
//#endregion
export { entries as t };
//# sourceMappingURL=entries-DC0KzvBm.d.cts.map