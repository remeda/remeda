import type { LazyResult } from "./LazyResult";

export type LazyDefinition = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This allows typescript the most flexibility in inferring function types, `unknown` doesn't always work!
  readonly lazy: LazyMeta & ((...args: any) => LazyFn);
  readonly lazyArgs: ReadonlyArray<unknown>;
};

type LazyFn = (
  value: unknown,
  index: number,
  items: ReadonlyArray<unknown>,
) => LazyResult<unknown>;

type LazyMeta = {
  readonly single?: boolean;
};
