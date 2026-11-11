import {
  dataLastImplementation0,
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
> =
  // `pipe` reads both marks off any lazy implementation, so neither is
  // required in general; a factory whose evaluators can stop must carry the
  // `makeStoppable` mark.
  Partial<ReducingMetadata & StoppableMetadata> &
    (
      | ((lazyArgument: LazyArgument<P>) => LazyEvaluator<T[number], unknown>)
      | (((
          lazyArgument: LazyArgument<P>,
        ) => StoppableLazyEvaluator<T[number], unknown>) &
          StoppableMetadata)
    );

type LazyDefinition<
  T extends IterableContainer,
  P extends readonly unknown[],
> = {
  readonly lazy: LazyEvaluatorFactory<T, P>;
  readonly lazyArgument: LazyArgument<P>;
};

/**
 * The one value a lazy implementation is built from, for the arguments `P` of
 * a data-last call: nothing, the single argument itself, or the arguments as a
 * tuple.
 */
export type LazyArgument<P extends readonly unknown[]> = P extends readonly []
  ? undefined
  : P extends readonly [(infer Argument)?]
    ? Argument
    : P;

/**
 * `lazyDataLastImplementation` for a `dataFirst` implementation that takes
 * only the data.
 */
export function lazyDataLastImplementation0<
  T extends IterableContainer,
  P extends readonly [],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
): LazyUnaryFunction<T, P, R> {
  // @ts-expect-error [ts2559] -- Allows us to build the lazy definition dynamically at runtime.
  const dataLast: Partial<SimplifiedWritable<LazyDefinition<T, P>>> =
    dataLastImplementation0(dataFirst);

  dataLast.lazy = lazy;
  // @ts-expect-error [ts2412] -- `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match the stored value to it.
  dataLast.lazyArgument = undefined;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned.
  return dataLast;
}

/**
 * `lazyDataLastImplementation` for a `dataFirst` implementation that takes
 * one argument after the data.
 */
export function lazyDataLastImplementation1<
  T extends IterableContainer,
  P extends readonly [unknown?],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
  argument: P[0],
): LazyUnaryFunction<T, P, R> {
  // @ts-expect-error [ts2559] -- Allows us to build the lazy definition dynamically at runtime.
  const dataLast: Partial<SimplifiedWritable<LazyDefinition<T, P>>> =
    dataLastImplementation1(dataFirst, argument);

  dataLast.lazy = lazy;
  // @ts-expect-error [ts2322] -- `LazyArgument` of a generic tuple stays deferred, so TypeScript can't match the stored value to it.
  dataLast.lazyArgument = argument;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned.
  return dataLast;
}

/**
 * `lazyDataLastImplementation` for a `dataFirst` implementation that takes
 * two arguments after the data.
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
