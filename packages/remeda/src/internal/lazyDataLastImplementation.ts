import {
  dataLastImplementation,
  type DataFirst,
  type UnaryFunction,
} from "./dataLastImplementation";
import type { StoppableMetadata } from "./makeStoppable";
import type { IterableContainer } from "./types/IterableContainer";
import type {
  LazyEvaluator,
  StoppableLazyEvaluator,
} from "./types/LazyEvaluator";
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
  // `pipe` decides whether fusing a run can pay off from the marks alone,
  // before it builds any evaluator, so an implementation whose evaluators can
  // stop the pipe must carry one.
  readonly lazy:
    | (((...args: P) => LazyEvaluator<T[number], unknown>) & LazyMeta)
    | (((...args: P) => StoppableLazyEvaluator<T[number], unknown>) &
        LazyMeta & { readonly isStoppable: true });
  readonly lazyArgs: P;
};

export type LazyMeta = Partial<StoppableMetadata> & {
  readonly isReducing?: true;
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
