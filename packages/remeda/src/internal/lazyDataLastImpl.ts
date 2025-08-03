/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LazyEvaluator } from "./types/LazyEvaluator";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic arguments.
 */
export function lazyDataLastImpl(
  fn: StrictFunction,
  args: ReadonlyArray<unknown>,
  lazy?: (...args: any) => LazyEvaluator,
  // TODO: We can probably provide better typing to the return type...
): unknown {
  // @ts-expect-error [ts2345] -- This error is accurate because we don't know
  // anything about `fn` so can't ensure that we are passing the correct
  // arguments to it, we just have to trust that the caller knows what they are
  // doing.
  const dataLast = (data: unknown): unknown => fn(data, ...args);

  return lazy === undefined
    ? dataLast
    : Object.assign(dataLast, { lazy, lazyArgs: args });
}
