import { purry } from "../purry";
import { lazyDataLastImpl } from "./lazyDataLastImpl";
import type { LazyDefinition } from "./types/LazyDefinition";
import type { StrictFunction } from "./types/StrictFunction";

/**
 * A version of `purry` for functions that also have a lazy implementation. The
 * data-last invocation carries the lazy definition on the returned function,
 * which is what lets `pipe` fuse it with the lazy steps around it.
 *
 * @param fn - The data-first implementation.
 * @param args - The arguments passed to the overloaded invocation.
 * @param lazy - The lazy implementation used by `pipe` for the data-last
 * invocation.
 * @see purry
 * @see purryFromLazy
 */
export const purryWithLazy = (
  fn: StrictFunction,
  args: readonly unknown[],
  lazy: LazyDefinition["lazy"],
): unknown =>
  fn.length - args.length === 1
    ? lazyDataLastImpl(fn, args, lazy)
    : purry(fn, args);
