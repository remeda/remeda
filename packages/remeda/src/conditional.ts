/* eslint-disable @typescript-eslint/no-deprecated -- (See TODO below.) */
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- we don't document the case params, it'd be redundant */

import { purryOn } from "./internal/purryOn";
import type { GuardType } from "./internal/types/GuardType";

type Case<
  In,
  Out,
  When extends (x: In) => boolean = (x: In) => boolean,
> = readonly [when: When, then: (x: GuardType<When, In> & In) => Out];

type DefaultCase<In, Out> = (x: In) => Out;

// For easier discovery and to allow us to have a single exported function we
// merge a set of utilities with the function itself. This provides a namespace-
// like structure where the function could be used directly by calling it, but
// also as the container of additional utilities.
type Utilities = {
  readonly defaultCase: typeof defaultCase;
};
type WithUtils<T> = T & Utilities;

const conditionalPlus: WithUtils<typeof conditional> = Object.assign(
  conditional,
  { defaultCase } satisfies Utilities,
);
export { conditionalPlus as conditional };

/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
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
function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Return0,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  fallback?: DefaultCase<T, Fallback>,
): (data: T) => Return0 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Return0,
  Return1,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  fallback?: DefaultCase<T, Fallback>,
): (data: T) => Return0 | Return1 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  fallback?: DefaultCase<T, Fallback>,
): (data: T) => Return0 | Return1 | Return2 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  fallback?: DefaultCase<T, Fallback>,
): (data: T) => Return0 | Return1 | Return2 | Return3 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  fallback?: DefaultCase<T, Fallback>,
): (data: T) => Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  fallback?: DefaultCase<T, Fallback>,
): (
  data: T,
) => Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  fallback?: DefaultCase<T, Fallback>,
): (
  data: T,
) =>
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  fallback?: DefaultCase<T, Fallback>,
): (
  data: T,
) =>
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Fn8 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Return8,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  case8: Case<T, Return8, Fn8>,
  fallback?: DefaultCase<T, Fallback>,
): (
  data: T,
) =>
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Return8
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Fn8 extends (x: T) => boolean,
  Fn9 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Return8,
  Return9,
  Fallback = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  case8: Case<T, Return8, Fn8>,
  case9: Case<T, Return9, Fn9>,
  fallback?: DefaultCase<T, Fallback>,
): (
  data: T,
) =>
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Return8
  | Return9
  | Fallback;

/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * To add a a default, catch-all, case you can provide a single callback
 * function (instead of a 2-tuple) as the last case. This is equivalent to
 * adding a case with a trivial always-true predicate as it's condition (see
 * example).
 *
 * For simpler cases you should also consider using `when` instead.
 *
 * !IMPORTANT! - Unlike similar implementations in Lodash and Ramda, the Remeda
 * implementation **doesn't** implicitly return `undefined` as a fallback when
 * when none of the cases match; and instead **throws** an exception in those
 * cases! You have to explicitly provide a default case, and can use
 * `constant(undefined)` as your last case to replicate that behavior.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
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
function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Return0,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Return0,
  Return1,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Return1 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Return1 | Return2 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Return1 | Return2 | Return3 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Return1 | Return2 | Return3 | Return4 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  fallback?: DefaultCase<T, Fallback>,
): Return0 | Return1 | Return2 | Return3 | Return4 | Return5 | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  fallback?: DefaultCase<T, Fallback>,
):
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  fallback?: DefaultCase<T, Fallback>,
):
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Fn8 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Return8,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  case8: Case<T, Return8, Fn8>,
  fallback?: DefaultCase<T, Fallback>,
):
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Return8
  | Fallback;

function conditional<
  T,
  Fn0 extends (x: T) => boolean,
  Fn1 extends (x: T) => boolean,
  Fn2 extends (x: T) => boolean,
  Fn3 extends (x: T) => boolean,
  Fn4 extends (x: T) => boolean,
  Fn5 extends (x: T) => boolean,
  Fn6 extends (x: T) => boolean,
  Fn7 extends (x: T) => boolean,
  Fn8 extends (x: T) => boolean,
  Fn9 extends (x: T) => boolean,
  Return0,
  Return1,
  Return2,
  Return3,
  Return4,
  Return5,
  Return6,
  Return7,
  Return8,
  Return9,
  Fallback = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1: Case<T, Return1, Fn1>,
  case2: Case<T, Return2, Fn2>,
  case3: Case<T, Return3, Fn3>,
  case4: Case<T, Return4, Fn4>,
  case5: Case<T, Return5, Fn5>,
  case6: Case<T, Return6, Fn6>,
  case7: Case<T, Return7, Fn7>,
  case8: Case<T, Return8, Fn8>,
  case9: Case<T, Return9, Fn9>,
  fallback?: DefaultCase<T, Fallback>,
):
  | Return0
  | Return1
  | Return2
  | Return3
  | Return4
  | Return5
  | Return6
  | Return7
  | Return8
  | Return9
  | Fallback;

function conditional(...args: ReadonlyArray<unknown>): unknown {
  return purryOn(isCase, conditionalImplementation, args);
}

function conditionalImplementation<In, Out>(
  data: In,
  ...cases: ReadonlyArray<Case<In, Out> | DefaultCase<In, Out>>
): Out {
  for (const current of cases) {
    if (typeof current === "function") {
      return current(data);
    }

    const [when, then] = current;
    if (when(data)) {
      return then(data);
    }
  }

  throw new Error("conditional: data failed for all cases");
}

function isCase(maybeCase: unknown): maybeCase is Case<unknown, unknown> {
  if (!Array.isArray(maybeCase)) {
    return false;
  }

  const [when, then, ...rest] = maybeCase as ReadonlyArray<unknown>;
  return (
    typeof when === "function" &&
    when.length <= 1 &&
    typeof then === "function" &&
    then.length <= 1 &&
    rest.length === 0
  );
}

// TODO [2025-09-04]: Remove the deprecated `defaultCase` utility.
/**
 *! **DEPRECATED**: `conditional` now accepts a default, catch-all, callback directly and no longer needs this utility wrapper. Use `constant(undefined)` as your last case instead (see example).
 *
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     // Was: `R.conditional.defaultCase(),`, Now:
 *     constant(undefined),
 *   ); //=> 'Hello ID: 3'
 * @deprecated `conditional` now accepts a default, catch-all, callback
 * directly and no longer needs this utility wrapper. Use `constant(undefined)`
 * as your last case instead (see example).
 */
function defaultCase(): Case<unknown, undefined>;

/**
 *! **DEPRECATED**: `conditional` now accepts a default, catch-all, callback directly and no longer needs this utility wrapper. Simply put your `then` callback as the last case (see example).
 *
 * @param then - You only need to provide the transformer, the predicate is
 * implicit. @default () => undefined, which is how Lodash and Ramda handle
 * the final fallback case.
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     // Was: `R.conditional.defaultCase(
 *     //  (something) => `Hello something (${JSON.stringify(something)})`,
 *     //),`, Now:
 *     (something) => `Hello something (${JSON.stringify(something)})`
 *   ); //=> 'Hello ID: 3'
 * @deprecated `conditional` now accepts a default, catch-all, callback
 * directly and no longer needs this utility wrapper. Simply put your `then`
 * callback as the last case.
 */
function defaultCase<In, Then extends (param: In) => unknown>(
  then: Then,
): Case<In, ReturnType<Then>>;
function defaultCase(
  then: (data: unknown) => unknown = trivialDefaultCase,
): Case<unknown, unknown> {
  return [acceptAnything, then];
}

// We memoize this so it isn't recreated on every invocation of `defaultCase`.
const acceptAnything = () => true as const;

// Lodash and Ramda return `undefined` as the default case.
const trivialDefaultCase = (): undefined => undefined;
