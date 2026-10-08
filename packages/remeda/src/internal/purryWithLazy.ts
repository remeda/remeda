import { lazyDataLastImpl } from "./lazyDataLastImpl";
import type { LazyDefinition } from "./types/LazyDefinition";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * A re-implementation of `purry` that allows passing a lazy function to the
 * internal `lazyDataLastImpl` which is not allowed in the exported `purry`
 * function we provide to users.
 *
 * Lazy implementations depend on the internal lazy protocol (`lazyControl`),
 * which we don't export or support.
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
