/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LazyEvaluator } from "./pipe";

export type LazyEvaluatorFactory = (...args: any) => LazyEvaluator;

export type MaybeLazyFunction = {
  (...args: any): unknown;
  readonly lazy?: LazyEvaluatorFactory;
};

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic arguments.
 */
export function lazyDataLastImpl(
  fn: MaybeLazyFunction,
  args: IArguments | ReadonlyArray<unknown>,
  lazyFactory: LazyEvaluatorFactory | undefined,
  // TODO: We can probably provide better typing to the return type...
): unknown {
  const ret = (data: unknown): unknown =>
    fn(
      data,
      // TODO: Once we bump our target beyond ES5 we can spread the args array directly and don't need this...
      ...(Array.from(args) as ReadonlyArray<unknown>),
    );

  const lazy = lazyFactory ?? fn.lazy;
  return lazy === undefined
    ? ret
    : Object.assign(ret, { lazy, lazyArgs: args });
}
