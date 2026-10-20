import type { StrictFunction } from "./types/StrictFunction";

type Single<Func> = Func & { readonly single: true };

/**
 * Marks a lazy implementation whose evaluators emit a single result and stop
 * the pipe there, which also ends the run of lazy functions it is part of.
 * Its `true` includes the can-stop mark, `null` (see `LazyMeta`), so a step
 * marked with this one needs no other.
 */
export const toSingle = <Func extends StrictFunction>(fn: Func): Single<Func> =>
  Object.assign(fn, { single: true as const });
