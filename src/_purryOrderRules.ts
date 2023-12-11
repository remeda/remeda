import type { NonEmptyArray } from './_types';

export type OrderRule<T> = OrderProjection<T> | OrderPair<T>;
export type CompareFunction<T> = (a: T, b: T) => number;

type OrderPair<T> = readonly [
  projector: OrderProjection<T>,
  direction: Direction,
];

type OrderProjection<T> = (x: T) => Comparable;

type Comparable = ComparablePrimitive | { valueOf(): ComparablePrimitive };
type ComparablePrimitive = number | string | boolean;

const ALL_DIRECTIONS = ['asc', 'desc'] as const;
type Direction = (typeof ALL_DIRECTIONS)[number];

const COMPARATOR = {
  asc: <T>(x: T, y: T) => x > y,
  desc: <T>(x: T, y: T) => x < y,
} as const;

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

  if (!isOrderRule(dataOrRule)) {
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
export function purryOrderRulesWithNumberArgument<T>(
  func: (
    data: ReadonlyArray<T>,
    compareFn: CompareFunction<T>,
    n: number
  ) => unknown,
  inputArgs: IArguments
): unknown {
  const [first, second, ...rest] = Array.from(inputArgs);

  // We need to pull the `n` argument out to make it work with purryOrderRules.
  let n: number;
  let args: ReadonlyArray<unknown>;
  if (typeof first === 'number') {
    // dataLast!
    n = first;
    args = [second, ...rest];
  } else if (typeof second === 'number') {
    // dataFirst!
    n = second;
    args = [first, ...rest];
  } else {
    throw new Error("Couldn't find a number argument in the called arguments");
  }

  return purryOrderRules<T>((...args) => func(...args, n), args);
}

function orderRuleComparer<T>(
  primaryRule: OrderRule<T>,
  secondaryRule?: OrderRule<T>,
  ...otherRules: ReadonlyArray<OrderRule<T>>
): (a: T, b: T) => number {
  const projector =
    typeof primaryRule === 'function' ? primaryRule : primaryRule[0];

  const direction = typeof primaryRule === 'function' ? 'asc' : primaryRule[1];
  const comparator = COMPARATOR[direction];

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

function isOrderRule<T>(x: ReadonlyArray<T> | OrderRule<T>): x is OrderRule<T> {
  if (typeof x === 'function') {
    // must be a OrderProjection
    return true;
  }

  const [maybeProjection, maybeDirection, ...rest] = x;

  if (rest.length > 0) {
    // Not a OrderPair if we have more stuff in the array
    return false;
  }

  return (
    typeof maybeProjection === 'function' &&
    ALL_DIRECTIONS.indexOf(maybeDirection as Direction) !== -1
  );
}
