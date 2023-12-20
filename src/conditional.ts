import { purryOn } from './_purryOn';

type Case<In, Out, Thru extends In = In> = readonly [
  when: ((data: In) => data is Thru) | ((data: In) => boolean),
  then: (data: Thru) => Out,
];

/**
 * Executes a transformer function based on the first matching predicate, functioning like a series of `if...else if...` statements. It sequentially evaluates each case and, upon finding a truthy predicate, runs the corresponding transformer. Further cases are then ignored.
 *
 * Unlike similar implementations in other frameworks, this does not return a default value when none of the cases match (like `undefined`); throwing an exception instead. To implement traditional default behavior, use `conditional.LEGACY_DEFAULT_CASE` as the final case, or `conditional.defaultCast(then)` which allows for customized default handling.
 *
 * Due to TypeScript's limitation in defining a type that is the negation of a type we can't refine types further in subsequent cases due to a previous type predicate rejecting. Using a `switch (true)` statement or ternary operators is recommended for more precise type control when such type narrowing is needed.
 *
 * @param data - The input data to be evaluated against the provided cases.
 * @param cases - A list of (up to 10) tuples, each defining a case. Each tuple consists of a predicate (or a type-predicate) and a transformer function that processes the data if its case matches.
 * @returns The output of the matched transformer. If no cases match, an exception is thrown. The return type is a union of the return types of all provided transformers.
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
export function conditional<
  T,
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
  Thru0 extends T = T,
  Thru1 extends T = T,
  Thru2 extends T = T,
  Thru3 extends T = T,
  Thru4 extends T = T,
  Thru5 extends T = T,
  Thru6 extends T = T,
  Thru7 extends T = T,
  Thru8 extends T = T,
  Thru9 extends T = T,
>(
  case0: Case<T, Return0, Thru0>,
  case1?: Case<T, Return1, Thru1>,
  case2?: Case<T, Return2, Thru2>,
  case3?: Case<T, Return3, Thru3>,
  case4?: Case<T, Return4, Thru4>,
  case5?: Case<T, Return5, Thru5>,
  case6?: Case<T, Return6, Thru6>,
  case7?: Case<T, Return7, Thru7>,
  case8?: Case<T, Return8, Thru8>,
  case9?: Case<T, Return9, Thru9>
): (
  data: T
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
 * Executes a transformer function based on the first matching predicate, functioning like a series of `if...else if...` statements. It sequentially evaluates each case and, upon finding a truthy predicate, runs the corresponding transformer. Further cases are then ignored.
 *
 * Unlike similar implementations in other frameworks, this does not return a default value when none of the cases match (like `undefined`); throwing an exception instead. To implement traditional default behavior, use `conditional.LEGACY_DEFAULT_CASE` as the final case, or `conditional.defaultCast(then)` which allows for customized default handling.
 *
 * Due to TypeScript's limitation in defining a type that is the negation of a type we can't refine types further in subsequent cases due to a previous type predicate rejecting. Using a `switch (true)` statement or ternary operators is recommended for more precise type control when such type narrowing is needed.
 *
 * @param data - The input data to be evaluated against the provided cases.
 * @param cases - A list of (up to 10) tuples, each defining a case. Each tuple consists of a predicate (or a type-predicate) and a transformer function that processes the data if its case matches.
 * @returns The output of the matched transformer. If no cases match, an exception is thrown. The return type is a union of the return types of all provided transformers.
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
export function conditional<
  T,
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
  Thru0 extends T = T,
  Thru1 extends T = T,
  Thru2 extends T = T,
  Thru3 extends T = T,
  Thru4 extends T = T,
  Thru5 extends T = T,
  Thru6 extends T = T,
  Thru7 extends T = T,
  Thru8 extends T = T,
  Thru9 extends T = T,
>(
  data: T,
  case0: Case<T, Return0, Thru0>,
  case1?: Case<T, Return1, Thru1>,
  case2?: Case<T, Return2, Thru2>,
  case3?: Case<T, Return3, Thru3>,
  case4?: Case<T, Return4, Thru4>,
  case5?: Case<T, Return5, Thru5>,
  case6?: Case<T, Return6, Thru6>,
  case7?: Case<T, Return7, Thru7>,
  case8?: Case<T, Return8, Thru8>,
  case9?: Case<T, Return9, Thru9>
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

export function conditional(): unknown {
  return purryOn(isCase, conditionalImplementation, arguments);
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

  throw new Error('conditional: data failed for all cases');
}

function isCase(maybeCase: unknown): maybeCase is Case<unknown, unknown> {
  if (!Array.isArray(maybeCase)) {
    return false;
  }

  const [when, then, ...rest] = maybeCase;
  return (
    typeof when === 'function' &&
    when.length <= 1 &&
    typeof then === 'function' &&
    then.length <= 1 &&
    rest.length === 0
  );
}

export namespace conditional {
  /**
   * A simplified case that accepts all data. Put this as the last case to prevent an exception from being thrown when none of the previous cases matched. If this is not the last case it will short-circuit anything after it.
   * @param then - You only need to provide the transformer, the predicate is implicit.
   */
  export const defaultCase = <In>(then: (data: In) => unknown) =>
    [() => true, then] as const;

  /**
   * An even simpler catch-all case that simply returns undefined, to match the behavior of other frameworks.
   * @see defaultCase.
   */
  export const LEGACY_DEFAULT_CASE = defaultCase(() => undefined);
}
