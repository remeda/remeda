import type { LazyMeta } from "./lazyDataLastImplementation";
import type { StrictFunction } from "./types/StrictFunction";

export const makeReducing = <Func extends StrictFunction>(fn: Func): Func =>
  Object.assign(fn, { isReducing: true } satisfies LazyMeta);
