import type { LazyDefinition } from "./types/LazyDefinition";
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
  lazy?: LazyDefinition["lazy"],
  // TODO: We can probably provide better typing to the return type...
): unknown {
  // @ts-expect-error [ts2322] -- This error is accurate because we don't know
  // anything about `fn` so can't ensure that we are passing the correct
  // arguments to it, we just have to trust that the caller knows what they are
  // doing.
  const implementation: (...args: readonly unknown[]) => unknown = fn;

  // Spreading `args` into the call goes through a generic builtin on every
  // invocation of the data-last function, so the most common data-last arity,
  // a single argument, is passed directly.
  const dataLast: DataLast =
    args.length === 1
      ? (data) => implementation(data, args[0])
      : (data) => implementation(data, ...args);

  if (lazy !== undefined) {
    dataLast.lazy = lazy;
    dataLast.lazyArgs = args;
  }

  return dataLast;
}

type DataLast = ((data: unknown) => unknown) & {
  lazy?: LazyDefinition["lazy"];
  lazyArgs?: readonly unknown[];
};
