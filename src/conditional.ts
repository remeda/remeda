/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- we don't document the case params, it'd be redundant */

import { purryOn } from "./internal/purryOn";
import { type GuardType } from "./internal/types";

type Case<
  In,
  Out,
  When extends (x: In) => boolean = (x: In) => boolean,
> = readonly [when: When, then: (x: GuardType<When, In> & In) => Out];

// We package the defaultCase helper into the function itself so that we
// encapsulate everything into a single export.
const conditionalPlus = Object.assign(conditional, { defaultCase });
export { conditionalPlus as conditional };

/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * For simpler cases you should also consider using `branch` instead.
 *
 * !IMPORTANT! - Unlike similar implementations in frameworks like Lodash and
 * Ramda, the Remeda implementation does **NOT** return a default/fallback
 * `undefined` value when none of the cases match; and instead will **throw** an
 * exception in those cases.
 * To add a default case use the `conditional.defaultCase` helper as the final
 * case of your implementation. By default it returns `undefined`, but could be
 * provided a transformer in order to return something else.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * @param cases - A list of (up to 10) tuples, each defining a case. Each tuple
 * consists of a predicate (or a type-predicate) and a transformer function that
 * processes the data if its case matches.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(...cases)(data);
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.pipe(
 *     nameOrId,
 *     R.conditional(
 *       [R.isString, (name) => `Hello ${name}`],
 *       [R.isNumber, (id) => `Hello ID: ${id}`],
 *       R.conditional.defaultCase(
 *         (something) => `Hello something (${JSON.stringify(something)})`,
 *       ),
 *     ),
 *   ); //=> 'Hello ID: 3'
 * @dataLast
 * @category Function
 */
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
  Return1 = never,
  Return2 = never,
  Return3 = never,
  Return4 = never,
  Return5 = never,
  Return6 = never,
  Return7 = never,
  Return8 = never,
  Return9 = never,
>(
  case0: Case<T, Return0, Fn0>,
  case1?: Case<T, Return1, Fn1>,
  case2?: Case<T, Return2, Fn2>,
  case3?: Case<T, Return3, Fn3>,
  case4?: Case<T, Return4, Fn4>,
  case5?: Case<T, Return5, Fn5>,
  case6?: Case<T, Return6, Fn6>,
  case7?: Case<T, Return7, Fn7>,
  case8?: Case<T, Return8, Fn8>,
  case9?: Case<T, Return9, Fn9>,
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
  | Return9;

/**
 * Executes a transformer function based on the first matching predicate,
 * functioning like a series of `if...else if...` statements. It sequentially
 * evaluates each case and, upon finding a truthy predicate, runs the
 * corresponding transformer, and returns, ignoring any further cases, even if
 * they would match.
 *
 * For simpler cases you should also consider using `branch` instead.
 *
 * !IMPORTANT! - Unlike similar implementations in frameworks like Lodash and
 * Ramda, the Remeda implementation does **NOT** return a default/fallback
 * `undefined` value when none of the cases match; and instead will **throw** an
 * exception in those cases.
 * To add a default case use the `conditional.defaultCase` helper as the final
 * case of your implementation. By default it returns `undefined`, but could be
 * provided a transformer in order to return something else.
 *
 * Due to TypeScript's inability to infer the result of negating a type-
 * predicate we can't refine the types used in subsequent cases based on
 * previous conditions. Using a `switch (true)` statement or ternary operators
 * is recommended for more precise type control when such type narrowing is
 * needed.
 *
 * @param data - The input data to be evaluated against the provided cases.
 * @param cases - A list of (up to 10) tuples, each defining a case. Each tuple
 * consists of a predicate (or a type-predicate) and a transformer function that
 * processes the data if its case matches.
 * @returns The output of the matched transformer. If no cases match, an
 * exception is thrown. The return type is a union of the return types of all
 * provided transformers.
 * @signature
 *   R.conditional(data, ...cases);
 * @example
 *   const nameOrId = 3 as string | number;
 *   R.conditional(
 *     nameOrId,
 *     [R.isString, (name) => `Hello ${name}`],
 *     [R.isNumber, (id) => `Hello ID: ${id}`],
 *     R.conditional.defaultCase(
 *       (something) => `Hello something (${JSON.stringify(something)})`,
 *     ),
 *   ); //=> 'Hello ID: 3'
 * @dataFirst
 * @category Function
 */
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
  Return1 = never,
  Return2 = never,
  Return3 = never,
  Return4 = never,
  Return5 = never,
  Return6 = never,
  Return7 = never,
  Return8 = never,
  Return9 = never,
>(
  data: T,
  case0: Case<T, Return0, Fn0>,
  case1?: Case<T, Return1, Fn1>,
  case2?: Case<T, Return2, Fn2>,
  case3?: Case<T, Return3, Fn3>,
  case4?: Case<T, Return4, Fn4>,
  case5?: Case<T, Return5, Fn5>,
  case6?: Case<T, Return6, Fn6>,
  case7?: Case<T, Return7, Fn7>,
  case8?: Case<T, Return8, Fn8>,
  case9?: Case<T, Return9, Fn9>,
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
  | Return9;

function conditional(...args: ReadonlyArray<unknown>): unknown {
  return purryOn(isCase, conditionalImplementation, args);
}

function conditionalImplementation<In, Out>(
  data: In,
  ...cases: ReadonlyArray<Case<In, Out>>
): Out {
  for (const [when, then] of cases) {
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

/**
 * A simplified case that accepts all data. Put this as the last case to
 * prevent an exception from being thrown when none of the previous cases
 * match.
 * If this is not the last case it will short-circuit anything after it.
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
 *     R.conditional.defaultCase(
 *       (something) => `Hello something (${JSON.stringify(something)})`,
 *     ),
 *   ); //=> 'Hello ID: 3'
 */
function defaultCase(): Case<unknown, undefined>;
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
