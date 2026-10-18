import type { StrictFunction } from "./types/StrictFunction";

type CanStop<Func> = Func & { readonly single: null };

/**
 * Marks a lazy implementation whose evaluators can stop the pipe early (they
 * return `STOP`, or a value through `lastLazyValue`). `pipe` fuses a run of
 * lazy functions only when one of them carries this mark: without one, every
 * item goes through every step anyway, so the functions run one after the
 * other on arrays, each through its data-first implementation.
 *
 * The mark is `single: null`, which `toSingle`'s `true` extends to steps that
 * also end the run (see `LazyMeta`).
 */
export const toCanStop = <Func extends StrictFunction>(
  fn: Func,
): CanStop<Func> =>
  // eslint-disable-next-line unicorn/no-null -- `null` is a value of its own here, telling a step that can stop apart from one that never set `single`; `LazyMeta` explains why it isn't `false`.
  Object.assign(fn, { single: null });
