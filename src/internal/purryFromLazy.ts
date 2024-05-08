import { pipe, type LazyDefinition, type LazyEvaluator } from "../pipe";

/**
 * A version of `purry` for cases where the only meaningful implementation is a
 * lazy one. This is useful for functions that don't have a built-in
 * implementation already, and that can't be optimized to take advantage of
 * having the complete array upfront.
 *
 * Under the hood the function uses `pipe` to utilize it's built-in lazy logic
 * and wraps the pipe with the required invocations to allow using the function
 * outside of pipes too.
 *
 * @param lazy - The main lazy implementation, it assumes that data is an
 * iterable (array-like).
 * @param args - The arguments passed to the overloaded invocation.
 * @see purry
 * @see pipe
 */

export function purryFromLazy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazy: (...args: any) => LazyEvaluator,
  args: ReadonlyArray<unknown>,
): unknown {
  const diff = args.length - lazy.length;

  if (diff === 1) {
    // dataFirst
    const [data, ...rest] = args;
    const lazyDefinition = { lazy, lazyArgs: rest } satisfies LazyDefinition;

    // @ts-expect-error [ts2353] - Pipe expects a function which *might* also have a lazy definition. We are tricking pipe here to take our lazyDefinition without any function attached to it.
    return pipe(data, lazyDefinition);
  }

  if (diff === 0) {
    const lazyDefinition = { lazy, lazyArgs: args } satisfies LazyDefinition;

    // @ts-expect-error [ts2353] - Pipe expects a function which *might* also have a lazy definition. We are tricking pipe here to take our lazyDefinition without any function attached to it.
    const dataLast = (data: unknown): unknown => pipe(data, lazyDefinition);
    return Object.assign(dataLast, lazyDefinition);
  }

  throw new Error("Wrong number of arguments");
}
