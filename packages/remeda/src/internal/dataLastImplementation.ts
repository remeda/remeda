import type { StrictFunction } from "./types/StrictFunction";

/**
 * Builds the data-last function for a `dataFirst` implementation.
 */
export const dataLastImplementation = (
  dataFirst: StrictFunction,
  args: readonly unknown[],
): ((data: unknown) => unknown) =>
  args.length === 1
    ? // Spreading `args` into the call goes through a generic builtin on
      // every invocation of the data-last function, so the most common
      // data-last arity, a single argument, is passed directly.
      (data) =>
        dataFirst(
          // @ts-expect-error [ts2345] -- This error is accurate because we
          // don't know anything about `fn` so can't ensure that we are
          // passing the correct arguments to it, we just have to trust that
          // the caller knows what they are doing.
          data,
          args[0],
        )
    : (data) =>
        dataFirst(
          // @ts-expect-error [ts2345] -- This error is accurate because we
          // don't know anything about `fn` so can't ensure that we are
          // passing the correct arguments to it, we just have to trust that
          // the caller knows what they are doing.
          data,
          ...args,
        );
