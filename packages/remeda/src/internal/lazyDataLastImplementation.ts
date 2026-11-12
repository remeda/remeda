import {
  dataLastImplementation1,
  dataLastImplementation2,
  type DataFirst,
  type UnaryFunction,
} from "./dataLastImplementation";
import type { ReducingMetadata } from "./makeReducing";
import type {
  StoppableLazyEvaluator,
  StoppableMetadata,
} from "./makeStoppable";
import type { IterableContainer } from "./types/IterableContainer";
import type { LazyEvaluator } from "./types/LazyEvaluator";
import type { SimplifiedWritable } from "./types/SimplifiedWritable";

export type LazyUnaryFunction<
  T extends IterableContainer = readonly unknown[],
  P extends readonly unknown[] = never,
  R = unknown,
> = UnaryFunction<T, R> & LazyDefinition<T, P>;

export type LazyEvaluatorFactory<
  T extends IterableContainer,
  P extends readonly unknown[],
> = LazyEvaluatorFactoryOf<T, readonly [lazyArgument: LazyArgument<P>]>;

export type LazyEvaluatorFactoryOf<
  T extends IterableContainer,
  P extends readonly unknown[],
> =
  // `pipe` reads both marks off any lazy implementation, so neither is
  // required in general; a factory whose evaluators can stop must carry the
  // `makeStoppable` mark.
  Partial<ReducingMetadata & StoppableMetadata> &
    (
      | ((...args: P) => LazyEvaluator<T[number], unknown>)
      | (((...args: P) => StoppableLazyEvaluator<T[number], unknown>) &
          StoppableMetadata)
    );

export type LazyArgument<P extends readonly unknown[]> = P extends readonly []
  ? // Fallback when no parameters are defined...
    undefined
  : P extends readonly [(infer Single)?]
    ? // Unbox a single argument
      Single
    : // Otherwise return it as-is.
      P;

type LazyDefinition<
  T extends IterableContainer,
  P extends readonly unknown[],
> = LazyDefinitionOf<T, LazyArgument<P>>;

type LazyDefinitionOf<T extends IterableContainer, P> = {
  readonly lazy: LazyEvaluatorFactoryOf<T, readonly [lazyArgument: P]>;
  readonly lazyArgument: P;
};

/**
 * Attaches a lazy implementation to a data-last function that the utility
 * builds itself, instead of going through a `purryWithLazy` helper. The
 * builders behind `purryWithLazy2` and `purryWithLazy3` give every utility the
 * same closure, whose call feedback then covers all their implementations, so
 * the engine can't inline any of them into it; a closure of the utility's own
 * keeps that call monomorphic.
 *
 * @param lazyArgument - The value `lazy` is built from: the argument itself
 * for one, or the arguments as a tuple for several.
 * @example
 *    return typeof dataOrIsEquals === "function"
 *      ? withLazyImplementation(
 *          dataLast(dataOrIsEquals),
 *          lazyImplementation,
 *          dataOrIsEquals,
 *        )
 *      : uniqueWithImplementation(dataOrIsEquals, isEquals);
 * @see purryWithLazy2
 */
export function withLazyImplementation<T extends IterableContainer, P, R>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional! Writing `lazy` and `lazyArgument` onto `dataLast` is what this function is for.
  dataLast: UnaryFunction<T, R> &
    Partial<SimplifiedWritable<LazyDefinitionOf<T, P>>>,
  lazy: LazyEvaluatorFactoryOf<T, readonly [lazyArgument: P]>,
  lazyArgument: NoInfer<P>,
): UnaryFunction<T, R> & LazyDefinitionOf<T, P> {
  dataLast.lazy = lazy;
  dataLast.lazyArgument = lazyArgument;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned.
  return dataLast;
}

/**
 * Builds the data-last function for a `dataFirst` implementation that takes
 * only the data, with the lazy implementation attached for `pipe`.
 */
export function lazyDataLastImplementation0<
  T extends IterableContainer,
  P extends readonly [],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
): LazyUnaryFunction<T, P, R> {
  // A closure, not `dataFirst` itself as in `purry1`: the lazy implementation
  // is written onto the data-last function, and `dataFirst` is shared by every
  // call of the utility.
  const dataLast = (data: T): R =>
    // @ts-expect-error [ts2345] -- The arguments are the elements of `P`, which TypeScript can't match to a generic tuple one by one.
    dataFirst(data);

  dataLast.lazy = lazy;
  dataLast.lazyArgument = undefined;

  // @ts-expect-error [ts2322] -- `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match `undefined` to it.
  return dataLast;
}

/**
 * Builds the data-last function for a `dataFirst` implementation that takes
 * one argument after the data, with the lazy implementation attached for
 * `pipe`.
 */
export function lazyDataLastImplementation1<
  T extends IterableContainer,
  P extends readonly [unknown],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactoryOf<T, P>,
  argument: P[0],
): LazyUnaryFunction<T, P, R> {
  // @ts-expect-error [ts2559] -- Allows us to build the lazy definition dynamically at runtime.
  const dataLast: Partial<SimplifiedWritable<LazyDefinition<T, P>>> =
    dataLastImplementation1(dataFirst, argument);

  // @ts-expect-error [ts2322] -- A function taking the parameters `P` is one taking `LazyArgument<P>` when `P` holds a single argument, but `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match the two.
  dataLast.lazy = lazy;
  // @ts-expect-error [ts2322] -- `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match the stored value to it.
  dataLast.lazyArgument = argument;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned.
  return dataLast;
}

/**
 * Builds the data-last function for a `dataFirst` implementation that takes
 * two arguments after the data, with the lazy implementation attached for
 * `pipe`.
 */
export function lazyDataLastImplementation2<
  T extends IterableContainer,
  P extends readonly [unknown, unknown],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
  first: P[0],
  second: P[1],
): LazyUnaryFunction<T, P, R> {
  // @ts-expect-error [ts2559] -- Allows us to build the lazy definition dynamically at runtime.
  const dataLast: Partial<SimplifiedWritable<LazyDefinition<T, P>>> =
    dataLastImplementation2(dataFirst, first, second);

  dataLast.lazy = lazy;
  // @ts-expect-error [ts2322] -- `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match the stored value to it.
  dataLast.lazyArgument = [first, second];

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned.
  return dataLast;
}
