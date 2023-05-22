/**
 * Copied from ts-toolbelt
 * https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/Narrow.ts
 */

/**
 * Similar to [[Cast]] but with a custom fallback `Catch`. If it fails,
 * it will enforce `Catch` instead of `A2`.
 * @param A1 to check against
 * @param A2 to try/test with
 * @param Catch to fallback to if the test failed
 * @returns `A1 | Catch`
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Try<'42', string>          // '42'
 * type test1 = A.Try<'42', number>          // never
 * type test1 = A.Try<'42', number, 'tried'> // 'tried'
 * ```
 */
export type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch;

/**
 * Describes types that can be narrowed
 */
export type Narrowable = string | number | bigint | boolean;

/**
 * @hidden
 */
type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends (...args: Array<any>) => any
        ? A[K]
        : NarrowRaw<A[K]>;
    };

/**
 * Prevent type widening on generic function parameters
 * @param A to narrow
 * @returns `A`
 * @example
 * ```ts
 * import {F} from 'ts-toolbelt'
 *
 * declare function foo<A extends any[]>(x: F.Narrow<A>): A;
 * declare function bar<A extends object>(x: F.Narrow<A>): A;
 *
 * const test0 = foo(['e', 2, true, {f: ['g', ['h']]}])
 * // `A` inferred : ['e', 2, true, {f: ['g']}]
 *
 * const test1 = bar({a: 1, b: 'c', d: ['e', 2, true, {f: ['g']}]})
 * // `A` inferred : {a: 1, b: 'c', d: ['e', 2, true, {f: ['g']}]}
 * ```
 */
export type Narrow<A> = Try<A, [], NarrowRaw<A>>;
