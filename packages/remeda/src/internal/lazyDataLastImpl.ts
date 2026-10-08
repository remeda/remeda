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
  args: readonly unknown[],
  lazy?: (...args: any) => LazyEvaluator,
  // TODO: We can probably provide better typing to the return type...
): unknown {
  const dataLast = createDataLast(
    // @ts-expect-error [ts2345] -- This error is accurate because we don't
    // know anything about `fn` so can't ensure that we are passing the correct
    // arguments to it, we just have to trust that the caller knows what they
    // are doing.
    fn,
    args,
  );

  if (lazy !== undefined) {
    dataLast.lazy = lazy;
    dataLast.lazyArgs = args;
  }

  return dataLast;
}

type DataLast = ((data: unknown) => unknown) & {
  lazy?: (...args: any) => LazyEvaluator;
  lazyArgs?: readonly unknown[];
};

// Spreading `args` into the call would go through a generic builtin on every
// invocation of the data-last function; the arities that cover almost every
// data-last call get a function that passes them directly.
function createDataLast(
  fn: (...args: readonly unknown[]) => unknown,
  args: readonly unknown[],
): DataLast {
  switch (args.length) {
    case 0:
      return (data) => fn(data);

    case 1:
      return (data) => fn(data, args[0]);

    case 2:
      return (data) => fn(data, args[0], args[1]);

    default:
      return (data) => fn(data, ...args);
  }
}
