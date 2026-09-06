import type { IterableContainer } from "./IterableContainer";

/**
 * The first element of `T`, or `undefined` when `T` might be empty.
 */
export type First<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...unknown[]]
    ? T[0]
    : T extends readonly [...infer Pre, infer Last]
      ? Last | Pre[0]
      : T[0] | undefined;
