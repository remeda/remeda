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
  LazyParameters extends readonly unknown[],
> =
  // `pipe` reads both marks off any lazy implementation, so neither is
  // required in general; a factory whose evaluators can stop must carry the
  // `makeStoppable` mark.
  Partial<ReducingMetadata & StoppableMetadata> &
    (
      | ((...lazyArgument: LazyParameters) => LazyEvaluator<T[number], unknown>)
      | (((
          ...lazyArgument: LazyParameters
        ) => StoppableLazyEvaluator<T[number], unknown>) &
          StoppableMetadata)
    );

type LazyDefinition<
  T extends IterableContainer,
  P extends readonly unknown[],
> = LazyDefinitionOf<T, LazyArgument<P>>;

type LazyDefinitionOf<T extends IterableContainer, Argument> = {
  readonly lazy: LazyEvaluatorFactoryOf<T, readonly [lazyArgument: Argument]>;
  readonly lazyArgument: Argument;
};

/**
 * The one value a lazy implementation is built from, for the arguments `P` of
 * a data-last call: `undefined`, the single argument itself, or the arguments
 * as a tuple.
 */
export type LazyArgument<P extends readonly unknown[]> = P extends readonly []
  ? undefined
  : P extends readonly [(infer Argument)?]
    ? Argument
    : P;

/**
 * Attaches a lazy implementation to a data-last function that the utility
 * builds itself. A closure from a shared builder shares its call feedback with
 * every utility built there, so the engine can't inline the implementation
 * into it once several utilities use it; a closure of the utility's own keeps
 * that call monomorphic.
 */
export function withLazyImplementation<
  T extends IterableContainer,
  Argument,
  R,
>(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Intentional! Writing `lazy` and `lazyArgument` onto `dataLast` is what this function is for.
  dataLast: UnaryFunction<T, R> &
    Partial<SimplifiedWritable<LazyDefinitionOf<T, Argument>>>,
  lazy: LazyEvaluatorFactoryOf<T, readonly [lazyArgument: Argument]>,
  lazyArgument: NoInfer<Argument>,
): UnaryFunction<T, R> & LazyDefinitionOf<T, Argument> {
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
