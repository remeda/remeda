import { processSingleLazyStep } from "./processSingleLazyStep";
import type { LazyDefinition } from "./types/LazyDefinition";

/**
 * A version of `purry` for cases where the only meaningful implementation is a
 * lazy one. This is useful for functions that don't have a built-in
 * implementation already, and that can't be optimized to take advantage of
 * having the complete array upfront.
 *
 * Both invocations run the lazy implementation item by item over the data, so
 * the function works outside of pipes too. The data-last invocation also
 * carries the lazy definition on the returned function, which is what lets
 * `pipe` fuse it with the lazy steps around it.
 *
 * @param lazy - The main lazy implementation, it assumes that data is an
 * iterable (array-like).
 * @param args - The arguments passed to the overloaded invocation.
 * @see purry
 * @see pipe
 */
export function purryFromLazy(
  lazy: LazyDefinition["lazy"],
  args: readonly unknown[],
): unknown {
  const diff = args.length - lazy.length;

  if (diff === 1) {
    // dataFirst
    const [data, ...rest] = args;
    return runLazy(lazy, rest, data);
  }

  if (diff === 0) {
    const dataLast = (data: unknown): unknown => runLazy(lazy, args, data);
    return Object.assign(dataLast, {
      lazy,
      lazyArgs: args,
    } satisfies LazyDefinition);
  }

  throw new Error("Wrong number of arguments");
}

function runLazy(
  lazy: LazyDefinition["lazy"],
  lazyArgs: readonly unknown[],
  data: unknown,
): unknown {
  const accumulator = processSingleLazyStep(
    // @ts-expect-error [ts2345] -- Lazy implementations assume their data is an iterable, and the overloads of the functions built on top of this one are what enforce it; a single generic helper can't see them.
    data,
    lazy(...lazyArgs),
  );
  return lazy.single === true ? accumulator[0] : accumulator;
}
