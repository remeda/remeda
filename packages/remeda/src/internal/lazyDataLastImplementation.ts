import {
  dataLastImplementation,
  type DataFirst,
  type UnaryFunction,
} from "./dataLastImplementation";
import type { IterableContainer } from "./types/IterableContainer";
import type { LazyEvaluator } from "./types/LazyEvaluator";
import type { SimplifiedWritable } from "./types/SimplifiedWritable";

export type LazyUnaryFunction<
  T extends IterableContainer = readonly unknown[],
  P extends readonly unknown[] = never,
  R = unknown,
> = UnaryFunction<T, R> & LazyDefinition<T, P>;

export type LazyDefinition<
  T extends IterableContainer,
  P extends readonly unknown[],
> = {
  readonly lazy: ((...args: P) => LazyEvaluator<T[number], unknown>) & LazyMeta;
  readonly lazyArgs: P;
};

type LazyMeta = {
  /**
   * How the step can end the iteration early, folded into one property so
   * that `pipe` reads a single one per step to plan a run:
   * - absent: it can't, every item goes through it (e.g., `map`, `filter`);
   * - `null`: it can stop the pipe (e.g., `take`, `zip`), via `toCanStop`;
   * - `true`: it emits a single result, stopping the pipe there, and ends
   *   the run, via `toSingle`.
   * Only `true` is truthy, so a truthiness read still asks whether the step
   * ends the run with a single result. `null` rather than `false` keeps that
   * read a valid condition under `strict-boolean-expressions`, which rejects
   * `false | undefined` as ambiguous but accepts `true | null | undefined`.
   */
  readonly single?: true | null;
};

// Allows us to build the lazy definition dynamically at runtime.
type MutableLazyDefinition<
  T extends IterableContainer,
  P extends readonly unknown[],
> = Partial<SimplifiedWritable<LazyDefinition<T, P>>>;

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic parameters.
 */
export function lazyDataLastImplementation<
  T extends IterableContainer,
  P extends readonly unknown[],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  args: P,
  lazy: LazyDefinition<T, P>["lazy"],
): LazyUnaryFunction<T, P, R> {
  const dataLast = dataLastImplementation(dataFirst, args);

  (dataLast as MutableLazyDefinition<T, P>).lazy = lazy;
  (dataLast as MutableLazyDefinition<T, P>).lazyArgs = args;

  // @ts-expect-error [ts2322] -- TypeScript doesn't narrow an object's declared type after its optional props are assigned, so it can't see that `dataLast` is now a complete `LazyUnaryFunction`.
  return dataLast;
}
