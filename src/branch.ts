/* eslint-disable @typescript-eslint/no-explicit-any --
 * function inference is stricter and doesn't work well when the arguments
 * aren't typed as `any` in the generic type declaration.
 */

import { type GuardType } from "./internal/types";

/**
 * Conditionally run a function based on a predicate, similar to
 * the [ternary `?:`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)
 * operator. If the optional `onFalse` function is not provided, the data will
 * be passed through.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * @param predicate - Function to decide which branch to run. If a type
 * predicate, it narrows types for both branches and the return value.
 * @param onTrue - Function to run when the predicate returns `true`.
 * @signature
 *   branch(predicate, onTrue)(data)
 *   branch(predicate, onTrue, onFalse)(data)
 * @example
 *   pipe(data, branch(isNullish, constant(42)));
 *   pipe(data, branch((x) => x > 3, add(1), multiply(2));
 *   map(data, branch(isNullish, (x, index) => x + index));
 * @dataLast
 * @category Function
 */
export function branch<
  T,
  Args extends Array<any>,
  Predicate extends (data: T, ...args: Args) => boolean,
  OnTrue extends (data: GuardType<Predicate, T>, ...args: Args) => unknown,
>(
  predicate: Predicate,
  onTrue: OnTrue,
): (
  data: T,
  ...args: Args
) => Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
export function branch<
  T,
  Args extends Array<any>,
  Predicate extends (data: T, ...args: Args) => boolean,
  OnTrue extends (data: GuardType<Predicate, T>, ...args: Args) => unknown,
  OnFalse extends (
    data: Exclude<T, GuardType<Predicate>>,
    ...args: Args
  ) => unknown,
>(
  predicate: Predicate,
  onTrue: OnTrue,
  onFalse: OnFalse,
): (data: T, ...args: Args) => ReturnType<OnFalse> | ReturnType<OnTrue>;

/**
 * Conditionally run a function based on a predicate, similar to
 * the [ternary `?:`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)
 * operator. If the optional `onFalse` function is not provided, the data will
 * be passed through.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * @param data - The data to be passed to all functions, as the first param.
 * @param predicate - The function that decides which of the 2 branches would
 * run. If a type-predicate is provided, then the types of both branches and the
 * return value would be narrowed.
 * @param onTrue - The function that would run when the predicate returns
 * `true`.
 * @signature
 *   branch(data, predicate, onTrue)
 *   branch(data, predicate, onTrue, onFalse, ...extraArgs)
 * @example
 *   branch(data, isNullish, constant(42));
 *   branch(data, (x) => x > 3, add(1), multiply(2));
 *   branch(data, isString, (x, radix) => parseInt(x, radix), identity(), 10);
 * @dataLast
 * @category Function
 */
export function branch<
  T,
  Predicate extends (data: T) => boolean,
  OnTrue extends (data: GuardType<Predicate, T>) => unknown,
>(
  data: T,
  predicate: Predicate,
  onTrue: OnTrue,
): Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
export function branch<
  T,
  Args extends Array<any>,
  Predicate extends (data: T, ...args: Args) => boolean,
  OnTrue extends (data: GuardType<Predicate, T>, ...args: Args) => unknown,
  OnFalse extends (
    data: Exclude<T, GuardType<Predicate>>,
    ...args: Args
  ) => unknown,
>(
  data: T,
  predicate: Predicate,
  onTrue: OnTrue,
  onFalse: OnFalse,
  ...args: Args
): ReturnType<OnFalse> | ReturnType<OnTrue>;

export function branch(...args: ReadonlyArray<unknown>): unknown {
  // To support an optional third argument we need to build our own heuristic
  // currying function and can't rely on the logic in `purry`.

  if (args.length === 2) {
    // The data-last, no-else, overload is the only signature we offer with 2
    // arguments.

    return (data: unknown, ...callArgs: ReadonlyArray<unknown>) =>
      // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
      branchImplementation(data, ...args, ...callArgs);
  }

  if (args.length === 3) {
    // We only have an issue when the function is invoked with 3 params, as it
    // could either be the data-last, with-else, overload, or the data-first,
    // no-else, overload. We need another check to decide what to do here...

    if (typeof args[0] === "function") {
      // We know that if the first argument is not a function it isn't a
      // predicate, so it has to be the data and we'll assume it's the data-
      // first call.

      // !IMPORTANT! This means that when functions are used as the data param
      // with the data-first, no-else, signature we will wrongly assume it's a
      // data-last call.

      return (data: unknown, ...callArgs: ReadonlyArray<unknown>) =>
        // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
        branchWithElseImplementation(data, ...args, ...callArgs);
    }

    // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
    return branchImplementation(...args);
  }

  // The data-first, with-else, overload is the only signature we offer that
  // takes 4 (or more!) arguments.

  // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
  return branchWithElseImplementation(...args);
}

const branchImplementation = <T, Args extends Array<any>, WhenTrue, WhenFalse>(
  data: T,
  predicate: (data: T, ...args: Args) => boolean,
  onTrue: (data: T, ...args: Args) => WhenTrue,
  ...args: Args
): T | WhenFalse | WhenTrue =>
  predicate(data, ...args) ? onTrue(data, ...args) : data;

const branchWithElseImplementation = <
  T,
  Args extends Array<any>,
  WhenTrue,
  WhenFalse,
>(
  data: T,
  predicate: (data: T, ...args: Args) => boolean,
  onTrue: (data: T, ...args: Args) => WhenTrue,
  onFalse: (data: T, ...args: Args) => WhenFalse,
  ...args: Args
): T | WhenFalse | WhenTrue =>
  predicate(data, ...args) ? onTrue(data, ...args) : onFalse(data, ...args);
