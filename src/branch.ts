/* eslint-disable @typescript-eslint/no-explicit-any */

import { type GuardType } from "./internal/types";

/**
 * Picks which mapping function to run based on the result of the predicate.
 *
 * @param predicate - A function that takes the data as it's first param and
 * returns a boolean. When true `onTrue` will be called on the same data. If a
 * type-guard is provided the types will be refined when passed to `onTrue` and
 * in the return type.
 * @param onTrue - A function to be called when the predicate is `true`.
 * @signature
 *   branch(predicate, onTrue, onFalse)(data)
 * @example
 *   pipe(data, branch((x) => x > 3, add(1), multiply(2));
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
 * Picks which mapping function to run based on the result of the predicate.
 *
 * @param data - The data to be passed to the functions.
 * @param predicate - A function that takes the data as it's first param and
 * returns a boolean. When true `onTrue` will be called on the same data. If a
 * type-guard is provided the types will be refined when passed to `onTrue` and
 * in the return type.
 * @param onTrue - A function to be called when the predicate is `true`.
 * @signature
 *   branch(predicate, onTrue, onFalse)(data)
 * @example
 *   pipe(data, branch((x) => x > 3, add(1), multiply(2));
 * @dataFirst
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

    if (typeof args[0] !== "function") {
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
