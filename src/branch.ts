/* eslint-disable @typescript-eslint/no-explicit-any */

type NarrowedWith<
  F extends (...args: ReadonlyArray<any>) => any,
  WhenFalse,
> = F extends (data: any, ...args: ReadonlyArray<any>) => data is infer Narrow
  ? Narrow
  : WhenFalse;

type MaybeRejectedBy<
  T,
  Predicate extends (...args: ReadonlyArray<any>) => any,
> = Exclude<T, NarrowedWith<Predicate, never>>;

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
  Predicate extends (data: T) => boolean,
  OnTrue extends (data: NarrowedWith<Predicate, T>) => any,
>(
  predicate: Predicate,
  onTrue: OnTrue,
): (data: T) => MaybeRejectedBy<T, Predicate> | ReturnType<OnTrue>;
export function branch<
  T,
  Predicate extends (data: T) => boolean,
  OnTrue extends (data: NarrowedWith<Predicate, T>) => any,
  OnFalse extends (data: MaybeRejectedBy<T, Predicate>) => any,
>(
  predicate: Predicate,
  onTrue: OnTrue,
  onFalse: OnFalse,
): (data: T) => ReturnType<OnFalse> | ReturnType<OnTrue>;

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
  OnTrue extends (data: NarrowedWith<Predicate, T>) => any,
>(
  data: T,
  predicate: Predicate,
  onTrue: OnTrue,
): MaybeRejectedBy<T, Predicate> | ReturnType<OnTrue>;
export function branch<
  T,
  Predicate extends (data: T) => boolean,
  OnTrue extends (data: NarrowedWith<Predicate, T>) => any,
  OnFalse extends (data: MaybeRejectedBy<T, Predicate>) => any,
>(
  data: T,
  predicate: Predicate,
  onTrue: OnTrue,
  onFalse: OnFalse,
): ReturnType<OnFalse> | ReturnType<OnTrue>;

export function branch(...args: ReadonlyArray<unknown>): unknown {
  // To support an optional third argument we need to build our own heuristic
  // currying function:
  // We know that data-last invocations could either have 2 or 3 arguments and
  // that data-first invocations could either have 3 or 4 arguments which means
  // we need to handle the 3 arguments case uniquely. We know that if the first
  // argument is not a function it isn't a predicate, so it has to be the data.
  // This might be wrong in some instances and cause issues for users, but it
  // should be very rare. We can consider restricting the input types of the
  // data to prevent this, but typing that is hard and might not be worth it.
  return args.length === 2 ||
    (args.length === 3 && typeof args[0] === "function")
    ? (data: unknown) =>
        // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
        branchImplementation(data, ...args)
    : // @ts-expect-error [ts2556] -- This is OK, we trust our typing of the overloaded functions
      branchImplementation(...args);
}

const branchImplementation = <T, WhenTrue, WhenFalse>(
  data: T,
  predicate: (data: T) => boolean,
  onTrue: (data: T) => WhenTrue,
  onFalse?: (data: T) => WhenFalse,
): T | WhenFalse | WhenTrue =>
  predicate(data) ? onTrue(data) : onFalse === undefined ? data : onFalse(data);
