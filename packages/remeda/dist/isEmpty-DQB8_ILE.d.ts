import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";

//#region src/isEmpty.d.ts

/**
 * A function that checks if the passed parameter is empty.
 *
 * This function has *limited* utility at the type level because **negating** it
 * does not yield a useful type in most cases because of TypeScript
 * limitations. Additionally, utilities which accept a narrower input type
 * provide better type-safety on their inputs. In most cases, you should use
 * one of the following functions instead:
 * * `isEmptyish` - supports a wider range of cases, accepts any input including nullish values, and does a better job at narrowing the result.
 * * `hasAtLeast` - when the input is just an array/tuple.
 * * `isStrictEqual` - when you just need to check for a specific literal value.
 * * `isNullish` - when you just care about `null` and `undefined`.
 * * `isTruthy` - when you need to also filter `number` and `boolean`.
 *
 * @param data - The variable to check.
 * @signature
 *    R.isEmpty(data)
 * @example
 *    R.isEmpty(''); //=> true
 *    R.isEmpty([]); //=> true
 *    R.isEmpty({}); //=> true
 *
 *    R.isEmpty('test'); //=> false
 *    R.isEmpty([1, 2, 3]); //=> false
 *    R.isEmpty({ a: "hello" }); //=> false
 *
 *    R.isEmpty(undefined); // Deprecated: use `isEmptyish`
 * @category Guard
 */
declare function isEmpty(data: IterableContainer): data is [];
declare function isEmpty<T extends object>(data: T): data is Record<keyof T, never>;
declare function isEmpty<T extends string>(data: T): data is "" extends T ? "" : never;
/**
 * @deprecated Use `isEmptyish` instead!
 */
declare function isEmpty<T extends string | undefined>(data: T): data is ("" extends T ? "" : never) | (undefined extends T ? undefined : never);
//#endregion
export { isEmpty as t };
//# sourceMappingURL=isEmpty-DQB8_ILE.d.ts.map