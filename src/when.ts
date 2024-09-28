/* eslint-disable @typescript-eslint/no-explicit-any --
 * function inference is stricter and doesn't work well when the arguments
 * aren't typed as `any` in the generic type declaration.
 */

import type { GuardType } from "./internal/types";

/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - Function to run when the predicate returns `true`.
 * @signature
 *   when(predicate, onTrue)(data, ...extraArgs)
 *   when(predicate, { onTrue, onFalse })(data, ...extraArgs)
 * @example
 *   pipe(data, when(isNullish, constant(42)));
 *   pipe(data, when((x) => x > 3, { onTrue: add(1), onFalse: multiply(2) }));
 *   map(data, when(isNullish, (x, index) => x + index));
 * @dataLast
 * @category Function
 */
export function when<
  T,
  ExtraArgs extends Array<any>,
  Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean,
  OnTrue extends (
    data: GuardType<Predicate, T>,
    ...extraArgs: ExtraArgs
  ) => unknown,
>(
  predicate: Predicate,
  onTrue: OnTrue,
): (
  data: T,
  ...extraArgs: ExtraArgs
) => Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
export function when<
  T,
  ExtraArgs extends Array<any>,
  Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean,
  OnTrue extends (
    data: GuardType<Predicate, T>,
    ...extraArgs: ExtraArgs
  ) => unknown,
  OnFalse extends (
    data: Exclude<T, GuardType<Predicate>>,
    ...extraArgs: ExtraArgs
  ) => unknown,
>(
  predicate: Predicate,
  branches: {
    readonly onTrue: OnTrue;
    readonly onFalse: OnFalse;
  },
): (
  data: T,
  ...extraArgs: ExtraArgs
) => ReturnType<OnFalse> | ReturnType<OnTrue>;

/**
 * Conditionally run a function based on a predicate, returning it's result (similar to
 * the [`?:` (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).)
 * If the optional `onFalse` function is not provided, the data will be passed
 * through in those cases.
 *
 * Supports type predicates to refine the types for both branches and the return
 * value.
 *
 * Additional arguments are passed to all functions. In data-first calls, they
 * are taken as variadic arguments; but in data-last calls, they are when the
 * curried function itself is called.
 *
 * For more complex cases check out `conditional`.
 *
 * @param data - The data to be passed to all functions, as the first param.
 * @param predicate - Decides if the `onTrue` mapper should run or not. If it's
 * a type predicate it also narrows types for the mappers and the return value.
 * @param onTrue - The function that would run when the predicate returns
 * `true`.
 * @param extraArgs - Additional arguments. These would be passed as is to the
 * `predicate`, `onTrue`, and `onFalse` functions.
 * @signature
 *   when(data, predicate, onTrue, ...extraArgs)
 *   when(data, predicate, { onTrue, onFalse }, ...extraArgs)
 * @example
 *   when(data, isNullish, constant(42));
 *   when(data, (x) => x > 3, { onTrue: add(1), onFalse: multiply(2) });
 *   when(data, isString, (x, radix) => parseInt(x, radix), 10);
 * @dataFirst
 * @category Function
 */
export function when<
  T,
  ExtraArgs extends Array<any>,
  Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean,
  OnTrue extends (
    data: GuardType<Predicate, T>,
    ...extraArgs: ExtraArgs
  ) => unknown,
>(
  data: T,
  predicate: Predicate,
  onTrue: OnTrue,
  ...extraArgs: ExtraArgs
): Exclude<T, GuardType<Predicate>> | ReturnType<OnTrue>;
export function when<
  T,
  ExtraArgs extends Array<any>,
  Predicate extends (data: T, ...extraArgs: ExtraArgs) => boolean,
  OnTrue extends (
    data: GuardType<Predicate, T>,
    ...extraArgs: ExtraArgs
  ) => unknown,
  OnFalse extends (
    data: Exclude<T, GuardType<Predicate>>,
    ...extraArgs: ExtraArgs
  ) => unknown,
>(
  data: T,
  predicate: Predicate,
  branches: {
    readonly onTrue: OnTrue;
    readonly onFalse: OnFalse;
  },
  ...extraArgs: ExtraArgs
): ReturnType<OnFalse> | ReturnType<OnTrue>;

export function when(...args: ReadonlyArray<unknown>): unknown {
  return args.length === 2
    ? (data: unknown, ...extraArgs: ReadonlyArray<unknown>) =>
        // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
        whenImplementation(data, ...args, ...extraArgs)
    : // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
      whenImplementation(...args);
}

const whenImplementation = <
  T,
  ExtraArgs extends Array<any>,
  WhenTrue,
  WhenFalse,
>(
  data: T,
  predicate: (data: T, ...extraArgs: ExtraArgs) => boolean,
  onTrueOrBranches:
    | ((data: T, ...extraArgs: ExtraArgs) => WhenTrue)
    | {
        readonly onTrue: (data: T, ...extraArgs: ExtraArgs) => WhenTrue;
        readonly onFalse: (data: T, ...extraArgs: ExtraArgs) => WhenFalse;
      },
  ...extraArgs: ExtraArgs
): T | WhenFalse | WhenTrue =>
  predicate(data, ...extraArgs)
    ? typeof onTrueOrBranches === "function"
      ? onTrueOrBranches(data, ...extraArgs)
      : onTrueOrBranches.onTrue(data, ...extraArgs)
    : typeof onTrueOrBranches === "function"
      ? data
      : onTrueOrBranches.onFalse(data, ...extraArgs);
