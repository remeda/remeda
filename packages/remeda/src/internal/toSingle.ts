import type { StrictFunction } from "./types/StrictFunction";

type Single<Func> = Func & { readonly single: true };

export const toSingle = <Func extends StrictFunction>(fn: Func): Single<Func> =>
  Object.assign(fn, { single: true as const });
