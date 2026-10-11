import { lazyDataLastImpl } from "./lazyDataLastImpl";
import type { LazyDefinition } from "./types/LazyDefinition";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * An internal-only re-implementation of `purry` that allows passing a lazy
 * function to the `lazyDataLastImpl`.
 *
 * This is done as a copy instead of having `purry` call it so that utilities
 * that are not lazy don't end up importing the whole lazy machinery they don't
 * use or need.
 */
export const purryWithLazy = (
  fn: StrictFunction,
  args: readonly unknown[],
  lazy: LazyDefinition["lazy"],
): unknown =>
  args.length >= fn.length
    ? fn(
        // @ts-expect-error [ts2345] -- This error is accurate because we don't
        // know anything about `fn` so can't ensure that we are passing the
        // correct arguments to it, we just have to trust that the caller knows
        // what they are doing.
        ...args,
      )
    : lazyDataLastImpl(fn, args, lazy);
