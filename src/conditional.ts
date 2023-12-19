import { purryOn } from './_purryOn';

type Case<In, Out, Thru extends In = In> = readonly [
  when: ((data: In) => data is Thru) | ((data: In) => boolean),
  then: (data: Thru) => Out,
];

/**
 * Runs the transformer paired to a truthy predicate, similar to a switch statement. It will go over the cases sequentially until a case's predicate returns true and then run that case's transformer. Any following cases would be ignored.
 *
 * In other frameworks this function is often implemented so that it returns a default value when non of the cases match (usually `undefined` in JS). This would force us to add the type of the default value to the return type even for if the conditions are exhaustive. To avoid this we do not return `undefined` and throw instead. If you need the legacy behavior use `conditional.LEGACY_DEFAULT_CASE` as the last case in your conditions. If you need more control over the default case you can use `conditional.defaultCast(then)`.
 *
 * This function is optimized for use with type predicates (functions that return `data is <something>`) so that the transformer gets a refined type to work with. Because of limitations in Typescript we can't refine the *following* conditions to exclude previous conditions' types. If you need more control over typing prefer an arrow function with a ternary operator or a `switch (true)` block which might be able to refine types more accurately.
 *
 * @param data - The data that would be run through the conditions, this could be anything.
 * @param cases - up to 10 2-tuples defining cases of the form `[predicate, transformer]`: predicate - a function that takes the data T and returns a boolean (or a narrowed type via `is <something>`); transformer - takes T (or the narrowed type) and can return anything.
 * @returns The result of the transformer that ran, or an exception if none of them ran. Because the transformer is selected at runtime, the return type is a union of all possible return types.
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
 * Runs the transformer paired to a truthy predicate, similar to a switch statement. It will go over the cases sequentially until a case's predicate returns true and then run that case's transformer. Any following cases would be ignored.
 *
 * In other frameworks this function is often implemented so that it returns a default value when non of the cases match (usually `undefined` in JS). This would force us to add the type of the default value to the return type even for if the conditions are exhaustive. To avoid this we do not return `undefined` and throw instead. If you need the legacy behavior use `conditional.LEGACY_DEFAULT_CASE` as the last case in your conditions. If you need more control over the default case you can use `conditional.defaultCast(then)`.
 *
 * This function is optimized for use with type predicates (functions that return `data is <something>`) so that the transformer gets a refined type to work with. Because of limitations in Typescript we can't refine the *following* conditions to exclude previous conditions' types. If you need more control over typing prefer an arrow function with a ternary operator or a `switch (true)` block which might be able to refine types more accurately.
 *
 * @param data - The data that would be run through the conditions, this could be anything.
 * @param cases - up to 10 2-tuples defining cases of the form `[predicate, transformer]`: predicate - a function that takes the data T and returns a boolean (or a narrowed type via `is <something>`); transformer - takes T (or the narrowed type) and can return anything.
 * @returns The result of the transformer that ran, or an exception if none of them ran. Because the transformer is selected at runtime, the return type is a union of all possible return types.
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
