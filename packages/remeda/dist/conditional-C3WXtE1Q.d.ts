import { t as GuardType } from "./GuardType-D21uLyKt.js";

//#region src/conditional.d.ts
type Case<In, Out, When extends (x: In) => boolean = (x: In) => boolean> = readonly [when: When, then: (x: GuardType<When, In> & In) => Out];
type DefaultCase<In, Out> = (x: In) => Out;
/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * *NOTE*: Some type-predicates may fail to narrow the param type of their
 * transformer; in such cases wrap your type-predicate in an anonymous arrow
 * function: e.g., instead of
 * `conditional(..., [myTypePredicate, myTransformer], ...)`, use
 * `conditional(..., [($) => myTypePredicate($), myTransformer], ...)`.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * @param cases - A list of (up to 10) cases. Each case can be either:
 * - A 2-tuple consisting of a predicate (or type-predicate) and a transformer
 *   function that processes the data if the predicate matches.
 * - A single callback function that acts as a default fallback case.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(...cases)(data);
 * @example
 *   const nameOrId = 3 as string | number | boolean;
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string`), can throw!.
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *       R.constant(undefined),
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.
 *
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *       (something) => `Hello something (${JSON.stringify(something)})`,
 *     ),
 *   ); //=> 'Hello ID: 3' (typed as `string`), won't throw.
 * @dataLast
 * @category Function
 */
declare function conditional<T, Fn0 extends (x: T) => boolean, Return0, Fallback = never>(case0: Case<T, Return0, Fn0>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Return0, Return1, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Return0, Return1, Return2, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Fn9 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Return9, Fallback = never>(case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, case9: Case<T, Return9, Fn9>, fallback?: DefaultCase<T, Fallback>): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Return9 | Fallback;
/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * *NOTE*: Some type-predicates may fail to narrow the param type of their
 * transformer; in such cases wrap your type-predicate in an anonymous arrow
 * function: e.g., instead of
 * `conditional(..., [myTypePredicate, myTransformer], ...)`, use
 * `conditional(..., [($) => myTypePredicate($), myTransformer], ...)`.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * @param data - The input data to be evaluated against the provided cases.
 * @param cases - A list of (up to 10) cases. Each case can be either:
 * - A 2-tuple consisting of a predicate (or type-predicate) and a transformer
 *   function that processes the data if the predicate matches.
 * - A single callback function that acts as a default fallback case.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(data, ...cases);
 * @example
 *   const nameOrId = 3 as string | number | boolean;
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *   ); //=> 'Hello ID: 3' (typed as `string`), can throw!.
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     R.constant(undefined),
 *   ); //=> 'Hello ID: 3' (typed as `string | undefined`), won't throw.
 *
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     (something) => `Hello something (${JSON.stringify(something)})`,
 *   ); //=> 'Hello ID: 3' (typed as `string`), won't throw.
 * @dataFirst
 * @category Function
 */
declare function conditional<T, Fn0 extends (x: T) => boolean, Return0, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, fallback?: DefaultCase<T, Fallback>): Return0 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Return0, Return1, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Return0, Return1, Return2, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Fallback;
declare function conditional<T, Fn0 extends (x: T) => boolean, Fn1 extends (x: T) => boolean, Fn2 extends (x: T) => boolean, Fn3 extends (x: T) => boolean, Fn4 extends (x: T) => boolean, Fn5 extends (x: T) => boolean, Fn6 extends (x: T) => boolean, Fn7 extends (x: T) => boolean, Fn8 extends (x: T) => boolean, Fn9 extends (x: T) => boolean, Return0, Return1, Return2, Return3, Return4, Return5, Return6, Return7, Return8, Return9, Fallback = never>(data: T, case0: Case<T, Return0, Fn0>, case1: Case<T, Return1, Fn1>, case2: Case<T, Return2, Fn2>, case3: Case<T, Return3, Fn3>, case4: Case<T, Return4, Fn4>, case5: Case<T, Return5, Fn5>, case6: Case<T, Return6, Fn6>, case7: Case<T, Return7, Fn7>, case8: Case<T, Return8, Fn8>, case9: Case<T, Return9, Fn9>, fallback?: DefaultCase<T, Fallback>): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Return6 | Return7 | Return8 | Return9 | Fallback;
//#endregion
export { conditional as t };
//# sourceMappingURL=conditional-C3WXtE1Q.d.ts.map