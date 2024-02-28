import type { CompareFunction, NonEmptyArray } from './_types';

// We define the comparators in a global const so that they are only
// instantiated once, and so we can couple a label (string) for them that could
// be used in runtime to refer to them (e.g. "asc", "desc").
const COMPARATORS = {
  asc: <T>(x: T, y: T) => x > y,
  desc: <T>(x: T, y: T) => x < y,
} as const;

/**
 * An order rule defines a projection/extractor that returns a comparable from
 * the data being compared. It would be run on each item being compared, and a
 * comparator would then be used on the results to determine the order.
 *
 * There are 2 forms of the order rule, a simple one which only provides the
 * projection function and assumes ordering is ascending, and a 2-tuple where
 * the first element is the projection function and the second is the direction;
 * this allows changing the direction without defining a more complex projection
 * to simply negate the value (e.g. `(x) => -x`).
 *
 * We rely on the javascript implementation of `<` and `>` for comparison, which
 * will attempt to transform both operands into a primitive comparable value via
 * the built in `valueOf` function (and then `toString`). It's up to the caller
 * to make sure that the projection is returning a value that makes sense for
 * this logic.
 *
 * It's important to note that there is no built-in caching/memoization of
 * projection function and therefore no guarantee that it would only be called
 * once.
 */
export type OrderRule<T> =
  | Projection<T>
  | readonly [projection: Projection<T>, direction: keyof typeof COMPARATORS];

type Projection<T> = (x: T) => Comparable;

// We define the Comparable based on how JS coerces values into primitives when
// used with the `<` and `>` operators.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion
type Comparable =
  | ComparablePrimitive
  | { [Symbol.toPrimitive](hint: string): ComparablePrimitive }
  | { valueOf(): ComparablePrimitive }
  | { toString(): string };

//  Notice that `boolean` is special in that it is coerced as a number (0 for
// `false`, 1 for `true`) implicitly.
type ComparablePrimitive = number | string | boolean;

/**
 * Allows functions that want to handle a variadic number of order rules a
 * a simplified API that hides most of the implementation details. The only
 * thing users of this function need to do is provide a function that would take
 * the data, and a compare function that can be used to determine the order
 * between the items of the array.
 * This functions takes care of the rest; it will parse rules, built the
 * comparer, and manage the purrying of the input arguments.
 */
export function purryOrderRules<T>(
  func: (data: ReadonlyArray<T>, compareFn: CompareFunction<T>) => unknown,
  inputArgs: IArguments | ReadonlyArray<unknown>
): unknown {
  // We rely on casting blindly here, but we rely on casting blindly everywhere
  // else when we call purry so it's fine...
  const [dataOrRule, ...rules] = (
    Array.isArray(inputArgs) ? inputArgs : Array.from(inputArgs)
  ) as
    | [data: ReadonlyArray<T>, ...rules: Readonly<NonEmptyArray<OrderRule<T>>>]
    | Readonly<NonEmptyArray<OrderRule<T>>>;

  if (!isOrderRule<T>(dataOrRule)) {
    // dataFirst!

    // @ts-expect-error [ts2556]: Typescript is failing to infer the type of rules
    // correctly here after the type refinement above, rules should be non-empty
    // when we get here.
    const compareFn = orderRuleComparer(...rules);
    return func(dataOrRule, compareFn);
  }

  // dataLast!

  // Important: initialize the comparer outside of the returned function so it
  // it's constructed and shared everywhere (it's stateless so should be safe
  // if used multiple times).
  const compareFn = orderRuleComparer(dataOrRule, ...rules);
  return (data: ReadonlyArray<T>) => func(data, compareFn);
}

/**
 * Some functions need an extra number argument, this helps facilitate that.
 */
export function purryOrderRulesWithArgument(
  func: <T>(
    data: ReadonlyArray<T>,
    compareFn: CompareFunction<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Function inference in typescript relies on `any` to work, it doesn't work with `unknown`
    arg: any
  ) => unknown,
  inputArgs: IArguments
): unknown {
  const [first, second, ...rest] = Array.from(
    inputArgs
  ) as ReadonlyArray<unknown>;

  // We need to pull the `n` argument out to make it work with purryOrderRules.
  let arg: unknown;
  let argRemoved: ReadonlyArray<unknown>;
  if (isOrderRule(second)) {
    // dataLast!
    arg = first;
    argRemoved = [second, ...rest];
  } else {
    // dataFirst!
    arg = second;
    argRemoved = [first, ...rest];
  }

  return purryOrderRules((...args) => func(...args, arg), argRemoved);
}

function orderRuleComparer<T>(
  primaryRule: OrderRule<T>,
  secondaryRule?: OrderRule<T>,
  ...otherRules: ReadonlyArray<OrderRule<T>>
): (a: T, b: T) => number {
  const projector =
    typeof primaryRule === 'function' ? primaryRule : primaryRule[0];

  const direction = typeof primaryRule === 'function' ? 'asc' : primaryRule[1];
  const comparator = COMPARATORS[direction];

  const nextComparer =
    secondaryRule === undefined
      ? undefined
      : orderRuleComparer(secondaryRule, ...otherRules);

  return (a, b) => {
    const projectedA = projector(a);
    const projectedB = projector(b);

    if (comparator(projectedA, projectedB)) {
      return 1;
    }

    if (comparator(projectedB, projectedA)) {
      return -1;
    }

    // The elements are equal base on the current comparator and projection. So
    // we need to check the elements using the next comparer, if one exists,
    // otherwise we consider them as true equal (returning 0).
    return nextComparer?.(a, b) ?? 0;
  };
}

function isOrderRule<T>(x: unknown): x is OrderRule<T> {
  if (isProjection(x)) {
    return true;
  }

  if (typeof x !== 'object' || !Array.isArray(x)) {
    return false;
  }

  const [maybeProjection, maybeDirection, ...rest] =
    x as ReadonlyArray<unknown>;

  return (
    isProjection(maybeProjection) &&
    typeof maybeDirection === 'string' &&
    maybeDirection in COMPARATORS &&
    // Has to be a 2-tuple
    rest.length === 0
  );
}

const isProjection = <T>(x: unknown): x is Projection<T> =>
  typeof x === 'function' && x.length === 1;
